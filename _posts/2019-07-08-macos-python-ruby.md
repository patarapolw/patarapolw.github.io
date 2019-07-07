---
layout: post
title: "Python and Ruby is pre-installed in macOS, but ..."
tag: [python, ruby, macOS, node, javascript]
---

Just don't install anything into System's programming languages, unless you have a virtual environment. Also, you can manage Python and Ruby's versions.

For Python, [pyenv](https://github.com/pyenv/pyenv) and there is [Virtual Environment](https://docs.python-guide.org/dev/virtualenvs/), which is quite opinionated. I use [poetry](https://poetry.eustace.io/), though. I also tried to fit `/.venv/` into the project folder, which requires additional settings.

Also, System's Python doesn't seem to be protected with `sudo`... Unprotected is bad, and you can do something wrong...

Of course, [PyCharm](https://www.jetbrains.com/pycharm/) makes this less of a fuss, and you don't have to choose between Pipenv and Poetry anymore.

For Ruby, you should use either [rvm](https://rvm.io/) or [rbenv](https://github.com/rbenv/rbenv), but there doesn't seem to be a concept of foldered Virtual Environment. However, if you don't use `rvm` or `rbenv`, you might have to `sudo` to install `Gems`, which is bad.

JavaScript's [Node.js](https://nodejs.org/en/), although aren't pre-installed, also has a problem of `sudo npm install -g`. If you don't want to `sudo`, you will have to properly install [nvm](https://github.com/nvm-sh/nvm).
