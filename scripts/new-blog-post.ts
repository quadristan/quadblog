import { writeFileSync, existsSync, mkdirSync, write } from 'fs'
import { join } from 'path';

if (process.argv.length < 2 || process.argv.includes("--help")) {
    console.log('usage: [blog post name] [list of tags]')
}

const blogPostName = process.argv[2];
const tags = process.argv.slice(3);

const dashedName = blogPostName.toLowerCase().replaceAll(/['".;,?]/g, '').replaceAll(/\s+/g, '-')
const now = new Date();
const year = `${now.getUTCFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`


const dirName = `./content/posts/${now.getUTCFullYear()}`
const filename = join(dirName, `${year}-${dashedName}.md`)

if (!existsSync(dirName)) {
    mkdirSync(dirName, { recursive: true })
}

const fileLines = [
    '---',
    `title: ${blogPostName}`,
    'author: Tristan Parisot',
    'tags:',
    ...tags.map(tag => `  - ${tag}`),
    '---',
    '',
    'intro',
    '<!--more-->',
    '## chapter1'
]
const fileContent = fileLines.join('\n');

writeFileSync(filename, fileContent);