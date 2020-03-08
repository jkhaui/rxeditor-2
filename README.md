## RxEditor

## [WIP]
_This repo is a mirror of the original repo which is currently private._
_RxEditor is currently a WIP proof-of-concept._

**Demo:** http://rxeditor.s3-website-ap-southeast-1.amazonaws.com/

   **Most features are currently not implemented; the main purpose of this demo currently is to provide a solution to questions like these (https://stackoverflow.com/questions/39122713/how-to-divide-the-text-into-separate-pages-like-google-docs-in-contenteditable) and show how pagination can be achieved in a web-based word processor. Try it out by typing stuff or pressing Enter until a page break is triggered.**

RxEditor is an attempt at creating an open-source, web-based and lightweight
alternative to word processors like Google Docs or Microsoft Word. It is
 built on Draft.js, ReactiveX (RxJS) and MobX.
 The other goal for this project is to demonstrate how functional programming
  and a mostly declarative approach, alongside React hooks, can be used to
   create an app that would traditionally be written in OOP-style.
   
The data-flow looks like this:
User input -> Events piped through RxJS middleware -> MobX store holding
 editor state is updated -> MobX reactively triggers re-rendering of the editor.
 
Heads up: code/type definitions/UI are a little sloppy in places as the focus
has been on experimenting with the core logic. Refactoring of the
 presentational layer is needed, especially the button components. Context
  logic can probably be refactored into a single hook.
  
Also note that Facebook oAuth login doesn't work in the demo, it's just for
 show. To test out the editor, either click "try without without an account", or
use the credentials below:

username: guest
password: guest 

This will authenticate your browser using a JWT, transferred over the wire
 from a GraphQL server.
 
Setup the repo locally:

> git clone https://github.com/jkhaui/rxeditor-2
 
> npm install

> npm start
