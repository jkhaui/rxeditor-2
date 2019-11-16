## RxEditor

## [WIP]
_This repo is a mirror of the original repo which is currently private._

_RxEditor is currently a WIP proof-of-concept._

Demo: http://reactive-docs.s3-website-ap-southeast-2.amazonaws.com/

RxEditor is an attempt at creating an open-source, web-based and lightweight
alternative to word processors like Google Docs or Microsoft Word. It is
 built on Draft.js, ReactiveX (RxJS) and MobX.
 
The data-flow looks like this:
User input -> Events piped through RxJS middleware -> MobX store holding
 editor state is updated -> MobX reactively triggers re-rendering of the editor.
 
At the moment, the main feature to try out is pagination (press enter or type
 something until a page break is triggered.)
 
Heads up: code/type definitions/UI are a little sloppy in places as the focus
has been on experimenting with the core logic. Refactoring of the
 presentational layer is needed, especially the button components. Context
  logic can probably be refactored into a single hook.
 
Setup the repo locally:

> git clone https://github.com/jkhaui/rxeditor-2
 
> npm install

> npm start