/* eslint-disable no-useless-escape */
const {
  initialSetup,
  layoutAliases,
  collections,
  shortcodes,
  filters,
  plugins,
  constants,
  events,
} = require('./_11ty');
const minifyHTML = require('./_11ty/transforms/minifyHTML');
const minifyJS = require('./_11ty/transforms/minifyJS');
const minifyJSON = require('./_11ty/transforms/minifyJSON');
const minifyXML = require('./_11ty/transforms/minifyXML');

const excerpt = require('eleventy-plugin-excerpt');

const htmlencode = require('htmlencode');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItToc = require('markdown-it-table-of-contents');
const slugify = require('slugify');

const pluginTOC = require('eleventy-plugin-toc');

const eleventyWebcPlugin = require('@11ty/eleventy-plugin-webc');

function markdownItSlugify(s) {
  return slugify(removeExtraText(s), { lower: true, remove: /[\=\":’'`,]/g });
}

function removeExtraText(s) {
  let newStr = String(s);
  newStr = newStr.replace(/\-beta\.\d+/, '');
  newStr = newStr.replace(/\-canary\.\d+/, '');
  newStr = newStr.replace(/New\ in\ v\d+\.\d+\.\d+/, '');
  newStr = newStr.replace(/Added\ in\ v\d+\.\d+\.\d+/, '');
  newStr = newStr.replace(/Coming\ soon\ in\ v\d+\.\d+\.\d+/, '');
  newStr = newStr.replace(/⚠️/g, '');
  newStr = newStr.replace(/[?!]/g, '');
  newStr = newStr.replace(/<[^>]*>/g, '');
  return newStr;
}

const pluginMermaid = function (eleventyConfig, options) {
  eleventyConfig.addPlugin(pluginTOC);

  eleventyConfig.addPassthroughCopy({
    'node_modules/mermaid/dist/': 'assets/mermaid',
    'node_modules/docsify/lib': 'assets/docsify',
    'node_modules/d3/dist': 'assets/d3',
    'contentassets/resources': 'resources',
  });

  const highlighter = eleventyConfig.markdownHighlighter;
  const html_tag = options?.html_tag || 'pre';
  const extra_classes = options?.extra_classes
    ? ' ' + options.extra_classes
    : '';

  eleventyConfig.addMarkdownHighlighter((str, language) => {
    if (language === 'mermaid') {
      return `<${html_tag} class="mermaid${extra_classes}">${htmlencode.htmlEncode(str)}</${html_tag}>`;
    }
    if (highlighter) {
      return highlighter(str, language);
    }
    return `<pre class="${language}">${str}</pre>`;
  });
  return {};
};

module.exports = function (eleventyConfig) {
  // --- Initial config

  initialSetup(eleventyConfig);

  // --- Layout aliases

  Object.entries(layoutAliases).forEach(([name, path]) => {
    eleventyConfig.addLayoutAlias(name, path);
  });

  // --- Collections

  Object.values(collections).forEach(({ name, body }) => {
    eleventyConfig.addCollection(name, body);
  });

  // --- Transformations

  eleventyConfig.addTransform('minifyHTML', minifyHTML);
  eleventyConfig.addTransform('minifyJSON', minifyJSON);
  eleventyConfig.addTransform('minifyXML', minifyXML);
  eleventyConfig.addTransform('minifyJS', minifyJS);

  // --- Filters

  Object.values(filters).forEach(({ name, body }) => {
    eleventyConfig.addFilter(name, body);
  });

  // --- Shortcodes

  Object.values(shortcodes).forEach(({ name, body }) => {
    eleventyConfig.addShortcode(name, body);
  });

  // --- Plugins

  Object.values(plugins).forEach(({ body, options }) => {
    eleventyConfig.addPlugin(body, options && options);
  });

  // --- After build events

  if (events.after.length > 0) {
    Object.values(events.after).forEach((afterBuildEvent) => {
      eleventyConfig.on('eleventy.after', afterBuildEvent);
    });
  }

  eleventyConfig.addPlugin(pluginMermaid);

  eleventyConfig.addPlugin(excerpt, { excerptSeparator: '<!--more-->' });

  // markdown

  let mdIt = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
  })
    .disable('code') // disable indent -> code block
    .use(markdownItAnchor, {
      slugify: markdownItSlugify,
      level: [2, 3, 4],
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        symbol: `
				<span class="sr-only" data-pagefind-ignore>Jump to heading</span>
				<span aria-hidden="true" data-pagefind-ignore>#</span>
			`,
        class: 'direct-link',
        placement: 'after',
      }),
    })
    .use(markdownItToc, {
      includeLevel: [2, 3],
      slugify: markdownItSlugify,
      format: function (heading) {
        return removeExtraText(heading);
      },
      transformLink: function (link) {
        if (typeof link === 'string') {
          // remove backticks from markdown code
          return link.replace(/\%60/g, '');
        }
        return link;
      },
    });

  // opt out of linkification for .io TLD, e.g. 11ty.io
  mdIt.linkify.tlds('.io', false);

  eleventyConfig.setLibrary('md', mdIt);

  eleventyConfig.addPairedShortcode('markdown', function (content) {
    return mdIt.renderInline(content);
  });
  eleventyConfig.addFilter('markdown', function (content) {
    return mdIt.renderInline(content);
  });

  // callouts
  eleventyConfig.addPairedShortcode(
    'callout',
    function (content, level = '', format = 'html', customLabel = '') {
      if (format === 'md') {
        content = mdIt.renderInline(content);
      } else if (format === 'md-block') {
        content = mdIt.render(content);
      }
      let label = '';
      if (customLabel) {
        label = customLabel;
      } else if (level === 'info' || level === 'error') {
        label = level.toUpperCase() + ':';
      } else if (level === 'warn') {
        label = 'WARNING:';
      }
      let labelHtml = label
        ? `<div class="elv-callout-label">${customLabel || label}</div>`
        : '';
      let contentHtml =
        (content || '').trim().length > 0
          ? `<div class="elv-callout-c">${content}</div>`
          : '';

      return `<div class="elv-callout${
        level ? ` elv-callout-${level}` : ''
      }">${labelHtml}${contentHtml}</div>`;
    },
  );

  eleventyConfig.addPlugin(eleventyWebcPlugin, {
    components: [
      './content/_includes/components/*.webc',
      'npm:@11ty/is-land/*.webc',
      'npm:@11ty/eleventy-img/*.webc',
    ],
    bundlePluginOptions: {
      transforms: [
        // 			function(bundleContent) {
        // 				// careful with HTML bundles here in the future
        // 				return `
        // /* @11ty/eleventy-plugin-bundle: ${bundleContent.length/1000} kB */
        // ${bundleContent}`;
        // 			}
      ],
    },
  });

  // --- Consolidating everything under content folder

  // eleventyConfig.addPlugin(markdownItToc);
  return {
    dir: {
      input: constants.CONTENT_FOLDER,
    },
    templateFormats: ['md', 'njk'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
