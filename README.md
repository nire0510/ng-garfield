# Lazy Loading of AngularJS Components

[AngularJS](https://angularjs.org/) can be a great client-side framework for web application development - **when done right**. It lets you organize your code and make it more readable, scalable, easy to maintain, and fast to develop. But working with [AngularJS](https://angularjs.org/) on large-scale applications can raise new challenges that you are not aware of while working solo, such as simultaneous modification of the same resources or the tightly coupled deployment process of multiple teams.  
 
In this post I’d like to share with you how I solved some of these challenges by breaking our monolithic project into several sub-projects, one per team, mainly thanks to lazy loading and compilation by demand of [AngularJS](https://angularjs.org/) components.

### Introduction
Here at Como we provide a web-based solution, which allows people with no programming knowledge at all to create their own mobile native apps. Several development teams or *squads*, in our jargon, work on different pages of the *Como Console*, the web application that our customers use to manage their mobile applications. So far so good. The complication is that multiple teams work on the same pages in the same project. For example, let's take the *Wizard*, one of the most used pages. It allows customers to edit their applications and then see it live in a mobile simulator. The *Wizard* used to be developed and maintained by three teams simultaneously: one in charge of the container itself, and the other two developing the various page templates which customers can add to their apps as content.  
 
![The Wizard page in action](http://images.nirelbaz.com/posts/como-wizard.gif)  
<small>**Figure #1: The *Wizard* page in action**</small>

This situation made the deployment process a real nightmare, since all the teams were dependent on each other and were tied to a single release train to publish new features or even bug fixes! Clearly, we had to make some changes in our project in order to allow more flexibility in our tightly coupled deployment process.  
 
### Guidelines
Let’s start off by breaking the *Wizard* page into pieces (diagram below) to get a grasp of what we were facing:  
 
![The Wizard page wireframe & technical details](http://images.nirelbaz.com/posts/wizard-wireframe.jpg)  
<small>**Figure #2: The *Wizard* page wireframe & technical details**</small>

After a few brainstorming sessions, we formulated the following guidelines:

1. Each team should be able to deploy its own project independently of the others.
1. The container project (<span style="color: blue;">blue zone</span>) should know nothing about the page template projects (<span style="color: green;">green zone</span>), except for the active directive path of the active page's template. The page templates, on the other hand, should still be able to use all services, both server and client, and components that are part of the container project, as if they were still part of the same project. In addition, they would be able to build and consume their own services and components.
1. The unified look and feel should be kept for all pages.
1. Apply the minimum number of changes required, in order to deploy to production ASAP and avoid impacting other areas of the project --> avoid massive QA cycle.
1. Avoid, or at least minimize, code duplications and maintenance between the teams.

### The Solution from 1,000 Ft
With these guidelines in hand, I began to work toward the solution. I knew it was necessary to split up the project, but as you may know, it's not in the nature of [AngularJS](https://angularjs.org/) to be lazily loaded either in a monolithic project or  multiple projects. I was surprised to find  that what helped me most was the [AngularJS](https://angularjs.org/) source code itself (it's actually clearer than the documentation!). After reading it through several times, eureka! I found a way to load, compile, and serve [AngularJS](https://angularjs.org/) components from remote projects and after the [AngularJS](https://angularjs.org/) initialization phase.  
 
Here's how the solution works (code follows): 

* The *Wizard* will be separated into 3 projects
  * one for the container project (<span style="color: blue;">blue zone</span>) which will also serve all shared services and components for the rest of the projects
  * two more projects for the page template projects (<span style="color: green;">green zone</span>). This is mainly to allow separated deployments for the different teams.
* Each page template (<span style="color: green;">green zone</span>) will be an [AngularJS](https://angularjs.org/) directive wrapped as an AMD module ([RequireJS](http://requirejs.org/)), to allow each to manage its own additional resources, such as stylesheets and HTML files. I call this a *widget*.
* The container project (<span style="color: blue;">blue zone</span>) will be in charge of the UI framework, as well as the shared controllers, services, and directives.
* Page template directives (<span style="color: green;">green zone</span>) will share the same [AngularJS](https://angularjs.org/) module as the container project (<span style="color: blue;">blue zone</span>), so that all components mentioned in the previous bullet can be used by the page template directives, as if they were part of the container project.
* Page template directives (<span style="color: green;">green zone</span>) will be served from different domains, to increase the number of concurrent HTTP requests allowed by browsers. This requires that these projects add the `Access-Control-Allow-Origin: *` header to their responses, of course.
* All images will be served from a shared CDN-based folder for better caching, avoiding storage redundancy, and increasing the number of concurrent HTTP requests.

 
### The Solution in Bits & Bytes
And now for the code! Here's the main source code for a demo I built for demonstration purposes:  
 
![Running the project with grunt](http://images.nirelbaz.com/posts/ng-garfield.gif)  
<small>**Figure #3: Running the project with grunt**</small>

#### Installing the Project
1. Clone the demo project from GitHub:  
`git clone https://github.com/nire0510/ng-garfield.git`
1. Open a terminal and go to the project’s root directory.
1. Install all required node modules:  
`npm install`  
 
#### Running the Project
1. Run the following commands, each in its own terminal instance, as shown in the video above:  
`grunt connect:site1`  
`grunt connect:site2`  
`grunt connect:main`  
This will run each “project” or folder in its own web server and port, to simulate the different websites.
1. Open your favorite web browser and go to http://localhost:9000.
1. Click on the big square plus icons; pages will be rendered in the editor.

**Congratulations!** You just saw the lazy loading mechanism in action: The main page belongs to the *Wizard* site, which we referred as the container project (<span style="color: blue;">blue zone</span>). This runs on port 9000. The page templates were lazily loaded and injected into the editor from two different origins that run on port 9001 (site1) and port 9002 (site2). These are the page template projects (<span style="color: green;">green zone</span>).

Pretty nice, huh? ;)  

#### Want to learn more about how it works?  
 
In the last section, I'll explain the main parts of the code that make this lazy loading trick happen. I encourage you, however, to go over all of it yourself. It's not that long or complicated, and the comments I added are pretty self-explanatory.  
 
**www.container-site.com/scripts/app.module.js**  
* `angular.module('ngGarfield').lazy = {...}`  
Well, that ruins the surprise. We just got started and we've already seen one of the most important building blocks. What I did here is to keep references of the [AngularJS](https://angularjs.org/) compiler services, because they are not exposed afterward. This will help me compile directives and services even after the [AngularJS](https://angularjs.org/) initialization phase . We will see how and where we use it later, when we cover the page template projects.
As for the `lazy` namespace, I did that just to distinguish between the “normal” [AngularJS](https://angularjs.org/) components and the ones that are lazily loaded.

* `var _paths = {...}`  
As you may know, we can use aliases for file paths in [RequireJS](http://requirejs.org/). The first aliases, `text and css`, are paths to a couple of [RequireJS](http://requirejs.org/) plugins: the first helps us to load HTML files (our templates), and the other, stylesheets.
As for the rest of the aliases you see here - these are the aliases of the two page template projects' root URLs. This will later help each widget to manage and configure its additional dependencies.

* `require.config({...})`  
Here we simply set the paths above and the timeout for [RequireJS](http://requirejs.org/) asynchronous requests.

* `requirejs.config({...})`  
This one is a known [RequireJS](http://requirejs.org/) hack for our text plugin, which makes it possible to perform cross-origin requests of our HTML files.

**www.container-site.com/scripts/editor/controllers/editor.controller.js**  
* `vm.selectPage = function (page) {...}`  
The only part in this file that is part of the mechanism is this method, which is called whenever the user clicks on one of the square icons. This method gets the requested page details and calls the most important service - our very lazy loader and compiler, `ngGarfield` ;).  
 
**www.container-site.com/scripts/common/services/garfield.service.js**  
This file is pretty self-explanatory, thanks to the comments inside. The steps are as follows:
1. Service checks if current page's directive is already registered in the [AngularJS](https://angularjs.org/) compiler.
If it isn’t, [RequireJS](http://requirejs.org/) downloads it AND all the dependencies that are mentioned in it.
1. Service creates a dummy DOM element with the directive's name as its attribute.
1. Service compiles the element with the scope it received before as a parameter.
Thanks to the `lazy` prefix of the directive signature, we have access to the [AngularJS](https://angularjs.org/) directive compiler service!
1. Service adds the output markup to the container it received as a parameter.

**www.pagetemplates-site1|2.com/pages/*/main.directive.js**  
The two other projects, `pagetemplates-site1 and 2`, serve page templates. As explained before, each page template is a *widget*, an atomic directive-based component, wrapped as an AMD module for loading its dependencies, such as stylesheets, HTML templates, and additional [AngularJS](https://angularjs.org/) components.
The following code is a boilerplate of a directive like this, to help you understand how it works:

```javascript
/* global define */
(function (angular) {
  'use strict'

  // Widget's internal dependencies. Notice that if a widget doesn't have additional dependencies, then there's no need to wrap directive in AMD module.
  // -text!- & -css!- prefixes are RequireJS plugins.
  // -site1- is an alias of the project's base URL we defined in app.module.js
  define([
    'text!site1/pages/links/main.view.html',   // Directive's template markup
    'css!site1/pages/links/style.css',         // Directive's stylesheet
    'site1/common/services/links.service'      // AngularJS service which is not part of the container project, but is required for this widget.
                                               // JavaScript files don't need to have a special prefix, neither do they need the .js file extension
  ],
    // The parameter -template- is the content of the first dependency (site1/pages/links/main.view.html)
    function (template) {

      // By attaching the widget to the same module as the container project, we make it feasible for the widget to use all of AngularJS components in the container project (no need to add them to the dependencies list above):
      angular.module('ngGarfield')
          // Notice the .lazy prefix; this is what makes the lazy loading magic to happen.
          // That's it! The rest of the code is a regular AngularJS directive :)
          .lazy.directive('analytics', directive);

      function directive() {

        var directive = {
          restrict: 'A',
          template: template,
          link: _link,
          controller: _controller
        };

        return directive;

        function _link (scope, element, attrs) {

        }

        function _controller () {
          var vm = this;

          vm.version = 1.0;
        }
      }
    });

})(window.angular);
```

### Wrapping It Up
In this post, I have shared a challenge we had in a large-scale [AngularJS](https://angularjs.org/) project, mainly due to the fact it was developed and maintained by several teams simultaneously. I also demonstrated my solution: lazy loading of [AngularJS](https://angularjs.org/) components, which helped us to overcome the obstacles we had while splitting the project without having to massively rewrite the project’s core, which we accomplished and deployed to production in no time.  
 
However, if you find yourself in the same situation with your project, know that there are many approaches out there you might want to consider, such as:

* Small modifications and hacks, which help manipulate libraries and frameworks you use to do some new tricks, like the one I showed here
* Adoption of other frameworks ([Polymer](http://www.polymer-project.org) was one of the options I considered back then)
* Project cloning, if you take into consideration the redundancy in maintenance and code duplication you might suffer from.

Eventually, it all depends on the timeframe you have, your team and their skills, and the willingness of your management to go for a more drastic approach like reconstructing or upgrading the project’s infrastructure.  
For us, the solution I shared above did the trick and was successful enough to go further and implement it on other sections of our product.  
 
***Thank you for reading!***