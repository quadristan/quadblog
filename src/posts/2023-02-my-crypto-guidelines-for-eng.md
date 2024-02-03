---
title: My cryptographic guidelines for Engineers
date: 2024-02-03T08:56:19.252Z
author: Tristan Parisot
tags:
  - Security
  - Cryptography 
  - Best Practices

---

I am a software engineer at Dashlane, and I create applications with security in
mind. Cryptography is a complex topic, and one of my roles as an Engineer is to
make sure to contain the complexity of topics.

What guidelines to give to a team to achieve safe cryptography without the
agonizing pain?

<!-- more -->

## Legal notes

We are software makers. Not lawyers. Encryption software is often regulated and
some specificities may need to be implemented in some countries. Make sure to
contact a law expert!

## Scenarios

### Choosing key sizes

A key size goal is to provide `bits of security`. A bit of security is a
dimension that indicates a safety level. Some factors are:

- The number of operations to brute-force the key. Be careful about this one,
  because that's out of your control and it evolves with technological
  breakthroughs. For example, 56-bit DES-keys could be cracked in 400 seconds in
  2015[^1]

- Consider that a N-bit key can safely transmit 2^(N/2) messages. The reason is
  statistical analysis. It is similar to the
  [Birthday problem](https://en.wikipedia.org/wiki/Birthday_problem).

So, what matters is the bit of security. If you need to send 2^128 messages with
the same key, you will need to have a key with 2^256 bits of security. An RSA
key of 4096 bits won't be enough!

My rule of thumb

<center>

| Key type                        | Key length |
| ------------------------------- | ---------- |
| Public/private keys (RSA,EdDSA) | 4096       |
| Symmetric keys (AES)            | 256        |

</center>

You can use 128 bits keys for short-lived symmetric key usage. For example,
checking the authenticity of a message during its transmission.

### Generating random data / Entropy

Always use a crypto library to generate random data. Do not generate data
byte-per-byte, prefer generating a whole buffer instead. It will be faster, and
the library can make sure to prevent entropy issues.

By definition, this entropy cannot be replayed, so you need to persist/transmit
it.

### Make two entities trusted

Trusting two entities will give each other a way to identify themselves, or
share secrets

#### With a certificate authority

The best way to have two entities trusted is to have a 3d party knowing both. If
you can have a CA for example, use it. However, the question of identity
remains. Each party must have an identity, and know the identity of the other
one.

#### Decentralized: using local data transfer

Bring the two entities close: physically, on the same network, same VPN, or in
Bluetooth range.

Create a manual operation that makes sure that one entity is targetting the
other, with a visual check. Could be a single-use code, or a QR code to scan.

Making a device scan a QR code is nice because it can already have public key
information in it. It is my preferred way.

If you can't have that, make sure that there is no possibility of connecting to
a wrong entity (IP/ARP spoofing)

### Sharing a key

#### Between two trusted entities

If the two entities are trusted and have a public key, use
[Diffie–Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)
to share a key.

you can rely on [Lib sodium](https://doc.libsodium.org/) to do it.

#### To a trusted entity

If the entity you trust has a public key, encrypt your key with their public
key.

See [Encrypting arbitrary data](#encrypting-arbitrary-data)

### Prevent unencrypted data tempering

#### General case: an entity to anyone that trusts it

Firstly, you need your entity to have a public key that is shared with others.
This entity does not need to know the other entities

Use a good signature algorithm such as
[EdDSA](https://en.wikipedia.org/wiki/EdDSA) to sign your data

#### Special case: between two trusted entities

If the two entities are trusted, they can generate use a shared-key.

You can use [HMAC](https://en.wikipedia.org/wiki/HMAC) to protect data with this
shared key.

You can still use the general case, but HMAC will be faster and safer. So, think
of HMAC!

### Encrypting arbitrary data, temper-proof

Encrypting data is done using an authenticated symmetric encryption algorithm.
Using encryption without authentication will give you very little performance
gain at the cost of security concerns, so I do not recommend it.

Use an algorithm such as
[ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305), again,
implemented in
[Libsodium](https://libsodium.gitbook.io/doc/secret-key_cryptography/aead/chacha20-poly1305)

To avoid leaks and the possibility of an attacker decrypting ALL the data,
generate a new specific key per encrypted piece of data. Encrypt this specific
key with a known key.

### Blind signing

Sometimes, you want a system to sign some data without acquiring knowledge of
it. An example:

Bob wants to send an important encrypted paper, and they want to have the proof
that they sent this paper (and not another one). They would like the postal
office to sign it without looking at its content.

Sending a hash to the system is therefore excluded because the signer could
infer some properties.

For that, you can use [VOPRF](https://github.com/cloudflare/voprf-ts).

## Low-level requirements

### Crypto parameters shouldn't end up in code, even public keys.

Use a secret management toolchain such as [Vault](https://www.vaultproject.io/)
to have secrets injected into your code.

Public keys should also be modifiable. You should have environment-specific
keys, and the ability to switch to a custom key during development.

### Use high-level crypto tools, not low-level tools

The crypto world is deep, and the deeper you go, the harder it becomes to use it
safely. Here is my categorization

<center>

| Level      | Def                                                     | Examples                    | Usage                                                       |
| ---------- | ------------------------------------------------------- | --------------------------- | ----------------------------------------------------------- |
| Protocols  | Solves a cross-boundary problem                         | TLS, OPAQUE, Diffie-Hellman | ✅ recommended                                              |
| Objects    | Solves a single-boundary problem                        | OPRF,HMAC                   | ✅ for single-security boundary 👎 with multiple-boundaries |
| Primitives | Lowest level element that solves a mathematical problem | SHA, AES                    | 👎 Usually, there is no valid use-case to use them.         |

</center>

### Do not implement things you can't maintain. Use external deps instead

This is not specific to cryptography, but crypto is a complex world. Likely, you
or your company do not have crypto expertise. Unless you have in your team a
cryptographer and a crypto analyst, you should not implement crypto
primitives/objects/protocols. Rely on other teams and company.

### Assume things leak

When developing, always assume that what is secret will be leaked somewhere at
some point. If you cannot counter this, for example, having a key rotation
mechanism, then there is an issue.

### Security by obfuscation is a no-go

The source code will leak, see above. People will reverse-engineer it, someone
can leave the company with a USB drive, and a new owner will find it...

And on top of that, think of this question:

> Would you rather change the whole codebase, or to re-generate keys?

### Assume crypto algorithms can be broken, prepare your system to use another one

Crypto algorithm gets broken over time depending on mathematical and physical
breakthroughs. Never forget that the basis of crypto is the impossibility of
finding fast implementation of slow algorithms.

I recommend having meta-data attached to persisted data or transmitted messages.
Following DDD practices, make sure to have a data source/repository layer, it
has more value than trying to abstract any crypto library.

### Never use low-entropy as an encryption key

Low entropy means: brute force is possible. Anything secured with a low entropy
can be easily obtained.

### Public-key cryptography is for keys, not for data

Public-key cryptography is based on the mathematical properties of big numbers.
In RSA, the size of the keys is roughly equal to the input size. If you need to
have public-key cryptography for content that can be bigger than the key, use
symmetric encryption. You can protect your symmetric key with a public key.

### Use HTTPS everywhere.

Between your users and the edge servers, let the CDN handle the certificates. If
you do not want a CDN, you can use Traefik and even leverage
[Let's encrypt](https://doc.traefik.io/traefik/user-guides/docker-compose/acme-tls).

[^1]: https://www.researchgate.net/figure/The-required-time-to-crack-an-algorithm-with-respect-to-its-key-size_tbl1_277905952
