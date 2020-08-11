# :information_desk_person: Create Markdown

> Create docs with a simple command

![GitHub last commit](https://img.shields.io/github/last-commit/lucas-lm/create-md)
![license](https://img.shields.io/github/license/lucas-lm/create-md)
![GitHub repo size](https://img.shields.io/github/repo-size/lucas-lm/create-md)

![demo](media/demo.gif)

**:pushpin: Table of Contents**

- [:information_desk_person: Create Markdown](#information_desk_person-create-markdown)
  - [:question: About](#question-about)
    - [Why did I make this?](#why-did-i-make-this)
  - [:eyes: Prerequisites](#eyes-prerequisites)
  - [:zap: Quick start](#zap-quick-start)
  - [:sparkles: Usage](#sparkles-usage)
    - [Examples](#examples)
  - [:rocket: Features](#rocket-features)
  - [:bomb: Next steps](#bomb-next-steps)
  - [:star2: Contributing](#star2-contributing)
  - [:bow: Author](#bow-author)
  - [:books: License](#books-license)

## :question: About

This simple CLI helps you to bootstrap a nice readme and licenses from the scratch.

> This readme was bootstrapped with create-md!

### Why did I make this?

Creating nice readmes, license and other docs for applications can be really boring, but it is important to make your project more understandable. In order to make this task easier, I create this CLI to automate the process of bootstrapping my readme and some other docs like licenses and issues templates.


## :eyes: Prerequisites

- Node.js
- npm or yarn

## :zap: Quick start

There is no need to install the package. With modern versions of yarn and npm there is no need to install the package. You can run it directly with `yarn create` and `npm init`.

If you use yarn:

```sh
yarn create md
```

If you prefer npm:

```sh
npm init md
```

Creating license:

```sh
yarn create md license
```
```sh
npm init md license
```

Hint: A well filled package.json helps the CLI to infer some default answers. Look an example below:

![package.json example](media/pkgexample.png)

## :sparkles: Usage

Call the CLI using `yarn create` or `npm init`. The create-md CLI take only one argument (template) and some options. If it is called with no argument, the default template will be used (readme). See below the list of available templates:

- readme (default)
- license (MIT license)

The table below describes the options available currently.

| Flag   | What is it? | What does it do? | Default value |
|--------|-------------|------------------| --------------|
| `--ext`  | File extension | Set the extension of the output file to the given value. | `.md` |
| `--name` | File name | Set the name of the output file to the given value. | template's name |

### Examples

> Note: `yarn create` can be replaced by `npm init` in the examples.

Creating a readme named foo inside a folder named docs:
```sh
yarn create md readme --name=docs/foo
```

Creating a license named with no extension
```sh
yarn create md license --ext=
```

## :rocket: Features

- Generate md files
- Answer inference
- Modular templates

## :bomb: Next steps

- [x] Refactor the basecode
- [x] Feature: ask if user want to overwrite files if already exists
- [ ] Feature: Auto generate table of contents
- [ ] Write tests
- [ ] Feature: take custom templates as argument
- [ ] Create more templates
- [ ] Feature: flag `--all` must create default markdowns (readme, license, issues etc.) in batch
- [ ] Allow .create-md (maybe .cmrc or .createmdrc, who knows...) config file

## :star2: Contributing

Contributions, issues and feature requests are welcome!

- ⭐️ Star the project
- 🐛 Find and report issues
- 📥 Submit PRs to help solve issues or add features

Feel free to check [issues page](https://github.com/lucas-lm/create-md/issues). You can also take a look at the contributing guide.

## :bow: Author

**Lucas Miranda** 
* Email: lucas-m@outlook.com
* Website: https://lucas-lm.github.io
* GitHub: [@lucas-lm](https://github.com/lucas-lm)
* LinkedIn: [@lucas-lm](https://linkedin.com/in/lucas-lm)

## :books: License

Copyright © 2020 Lucas Miranda
This project is [MIT](license.md) licensed.
