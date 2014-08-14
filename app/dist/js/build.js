(function (module) {

  /**
   * @license AngularJS v1.2.21
   * (c) 2010-2014 Google, Inc. http://angularjs.org
   * License: MIT
   */
  (function(window, angular, undefined) {'use strict';

  /**
   * @ngdoc module
   * @name ngRoute
   * @description
   *
   * # ngRoute
   *
   * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
   *
   * ## Example
   * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
   *
   *
   * <div doc-module-components="ngRoute"></div>
   */
   /* global -ngRouteModule */
  var ngRouteModule = module.
                          provider('$route', $RouteProvider);

  /**
   * @ngdoc provider
   * @name $routeProvider
   * @kind function
   *
   * @description
   *
   * Used for configuring routes.
   *
   * ## Example
   * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
   *
   * ## Dependencies
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   */
  function $RouteProvider(){
    function inherit(parent, extra) {
      return angular.extend(new (angular.extend(function() {}, {prototype:parent}))(), extra);
    }

    var routes = {};

    /**
     * @ngdoc method
     * @name $routeProvider#when
     *
     * @param {string} path Route path (matched against `$location.path`). If `$location.path`
     *    contains redundant trailing slash or is missing one, the route will still match and the
     *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
     *    route definition.
     *
     *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
     *        to the next slash are matched and stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain named groups starting with a colon and ending with a star:
     *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
     *
     *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
     *    `/color/brown/largecode/code/with/slashes/edit` and extract:
     *
     *    * `color: brown`
     *    * `largecode: code/with/slashes`.
     *
     *
     * @param {Object} route Mapping information to be assigned to `$route.current` on route
     *    match.
     *
     *    Object properties:
     *
     *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
     *      newly created scope or the name of a {@link angular.Module#controller registered
     *      controller} if passed as a string.
     *    - `controllerAs` – `{string=}` – A controller alias name. If present the controller will be
     *      published to scope under the `controllerAs` name.
     *    - `template` – `{string=|function()=}` – html template as a string or a function that
     *      returns an html template as a string which should be used by {@link
     *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
     *      This property takes precedence over `templateUrl`.
     *
     *      If `template` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
     *      template that should be used by {@link ngRoute.directive:ngView ngView}.
     *
     *      If `templateUrl` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
     *      be injected into the controller. If any of these dependencies are promises, the router
     *      will wait for them all to be resolved or one to be rejected before the controller is
     *      instantiated.
     *      If all the promises are resolved successfully, the values of the resolved promises are
     *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
     *      fired. If any of the promises are rejected the
     *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired. The map object
     *      is:
     *
     *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
     *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
     *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
     *        and the return value is treated as the dependency. If the result is a promise, it is
     *        resolved before its value is injected into the controller. Be aware that
     *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
     *        functions.  Use `$route.current.params` to access the new route parameters, instead.
     *
     *    - `redirectTo` – {(string|function())=} – value to update
     *      {@link ng.$location $location} path with and trigger route redirection.
     *
     *      If `redirectTo` is a function, it will be called with the following parameters:
     *
     *      - `{Object.<string>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route templateUrl.
     *      - `{string}` - current `$location.path()`
     *      - `{Object}` - current `$location.search()`
     *
     *      The custom `redirectTo` function is expected to return a string which will be used
     *      to update `$location.path()` and `$location.search()`.
     *
     *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only `$location.search()`
     *      or `$location.hash()` changes.
     *
     *      If the option is set to `false` and url in the browser changes, then
     *      `$routeUpdate` event is broadcasted on the root scope.
     *
     *    - `[caseInsensitiveMatch=false]` - {boolean=} - match routes without being case sensitive
     *
     *      If the option is set to `true`, then the particular route can be matched without being
     *      case sensitive
     *
     * @returns {Object} self
     *
     * @description
     * Adds a new route definition to the `$route` service.
     */
    this.when = function(path, route) {
      routes[path] = angular.extend(
        {reloadOnSearch: true},
        route,
        path && pathRegExp(path, route)
      );

      // create redirection for trailing slashes
      if (path) {
        var redirectPath = (path[path.length-1] == '/')
              ? path.substr(0, path.length-1)
              : path +'/';

        routes[redirectPath] = angular.extend(
          {redirectTo: path},
          pathRegExp(redirectPath, route)
        );
      }

      return this;
    };

     /**
      * @param path {string} path
      * @param opts {Object} options
      * @return {?Object}
      *
      * @description
      * Normalizes the given path, returning a regular expression
      * and the original path.
      *
      * Inspired by pathRexp in visionmedia/express/lib/utils.js.
      */
    function pathRegExp(path, opts) {
      var insensitive = opts.caseInsensitiveMatch,
          ret = {
            originalPath: path,
            regexp: path
          },
          keys = ret.keys = [];

      path = path
        .replace(/([().])/g, '\\$1')
        .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option){
          var optional = option === '?' ? option : null;
          var star = option === '*' ? option : null;
          keys.push({ name: key, optional: !!optional });
          slash = slash || '';
          return ''
            + (optional ? '' : slash)
            + '(?:'
            + (optional ? slash : '')
            + (star && '(.+?)' || '([^/]+)')
            + (optional || '')
            + ')'
            + (optional || '');
        })
        .replace(/([\/$\*])/g, '\\$1');

      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
    }

    /**
     * @ngdoc method
     * @name $routeProvider#otherwise
     *
     * @description
     * Sets route definition that will be used on route change when no other route definition
     * is matched.
     *
     * @param {Object} params Mapping information to be assigned to `$route.current`.
     * @returns {Object} self
     */
    this.otherwise = function(params) {
      this.when(null, params);
      return this;
    };


    this.$get = ['$rootScope',
                 '$location',
                 '$routeParams',
                 '$q',
                 '$injector',
                 '$http',
                 '$templateCache',
                 '$sce',
        function($rootScope, $location, $routeParams, $q, $injector, $http, $templateCache, $sce) {

      /**
       * @ngdoc service
       * @name $route
       * @requires $location
       * @requires $routeParams
       *
       * @property {Object} current Reference to the current route definition.
       * The route definition contains:
       *
       *   - `controller`: The controller constructor as define in route definition.
       *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
       *     controller instantiation. The `locals` contain
       *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
       *
       *     - `$scope` - The current route scope.
       *     - `$template` - The current route template HTML.
       *
       * @property {Object} routes Object with all route configuration Objects as its properties.
       *
       * @description
       * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
       * It watches `$location.url()` and tries to map the path to an existing route definition.
       *
       * Requires the {@link ngRoute `ngRoute`} module to be installed.
       *
       * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
       *
       * The `$route` service is typically used in conjunction with the
       * {@link ngRoute.directive:ngView `ngView`} directive and the
       * {@link ngRoute.$routeParams `$routeParams`} service.
       *
       * @example
       * This example shows how changing the URL hash causes the `$route` to match a route against the
       * URL, and the `ngView` pulls in the partial.
       *
       * Note that this example is using {@link ng.directive:script inlined templates}
       * to get it working on jsfiddle as well.
       *
       * <example name="$route-service" module="ngRouteExample"
       *          deps="angular-route.js" fixBase="true">
       *   <file name="index.html">
       *     <div ng-controller="MainController">
       *       Choose:
       *       <a href="Book/Moby">Moby</a> |
       *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
       *       <a href="Book/Gatsby">Gatsby</a> |
       *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
       *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
       *
       *       <div ng-view></div>
       *
       *       <hr />
       *
       *       <pre>$location.path() = {{$location.path()}}</pre>
       *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
       *       <pre>$route.current.params = {{$route.current.params}}</pre>
       *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
       *       <pre>$routeParams = {{$routeParams}}</pre>
       *     </div>
       *   </file>
       *
       *   <file name="book.html">
       *     controller: {{name}}<br />
       *     Book Id: {{params.bookId}}<br />
       *   </file>
       *
       *   <file name="chapter.html">
       *     controller: {{name}}<br />
       *     Book Id: {{params.bookId}}<br />
       *     Chapter Id: {{params.chapterId}}
       *   </file>
       *
       *   <file name="script.js">
       *     angular.module('ngRouteExample', ['ngRoute'])
       *
       *      .controller('MainController', function($scope, $route, $routeParams, $location) {
       *          $scope.$route = $route;
       *          $scope.$location = $location;
       *          $scope.$routeParams = $routeParams;
       *      })
       *
       *      .controller('BookController', function($scope, $routeParams) {
       *          $scope.name = "BookController";
       *          $scope.params = $routeParams;
       *      })
       *
       *      .controller('ChapterController', function($scope, $routeParams) {
       *          $scope.name = "ChapterController";
       *          $scope.params = $routeParams;
       *      })
       *
       *     .config(function($routeProvider, $locationProvider) {
       *       $routeProvider
       *        .when('/Book/:bookId', {
       *         templateUrl: 'book.html',
       *         controller: 'BookController',
       *         resolve: {
       *           // I will cause a 1 second delay
       *           delay: function($q, $timeout) {
       *             var delay = $q.defer();
       *             $timeout(delay.resolve, 1000);
       *             return delay.promise;
       *           }
       *         }
       *       })
       *       .when('/Book/:bookId/ch/:chapterId', {
       *         templateUrl: 'chapter.html',
       *         controller: 'ChapterController'
       *       });
       *
       *       // configure html5 to get links working on jsfiddle
       *       $locationProvider.html5Mode(true);
       *     });
       *
       *   </file>
       *
       *   <file name="protractor.js" type="protractor">
       *     it('should load and compile correct template', function() {
       *       element(by.linkText('Moby: Ch1')).click();
       *       var content = element(by.css('[ng-view]')).getText();
       *       expect(content).toMatch(/controller\: ChapterController/);
       *       expect(content).toMatch(/Book Id\: Moby/);
       *       expect(content).toMatch(/Chapter Id\: 1/);
       *
       *       element(by.partialLinkText('Scarlet')).click();
       *
       *       content = element(by.css('[ng-view]')).getText();
       *       expect(content).toMatch(/controller\: BookController/);
       *       expect(content).toMatch(/Book Id\: Scarlet/);
       *     });
       *   </file>
       * </example>
       */

      /**
       * @ngdoc event
       * @name $route#$routeChangeStart
       * @eventType broadcast on root scope
       * @description
       * Broadcasted before a route change. At this  point the route services starts
       * resolving all of the dependencies needed for the route change to occur.
       * Typically this involves fetching the view template as well as any dependencies
       * defined in `resolve` route property. Once  all of the dependencies are resolved
       * `$routeChangeSuccess` is fired.
       *
       * @param {Object} angularEvent Synthetic event object.
       * @param {Route} next Future route information.
       * @param {Route} current Current route information.
       */

      /**
       * @ngdoc event
       * @name $route#$routeChangeSuccess
       * @eventType broadcast on root scope
       * @description
       * Broadcasted after a route dependencies are resolved.
       * {@link ngRoute.directive:ngView ngView} listens for the directive
       * to instantiate the controller and render the view.
       *
       * @param {Object} angularEvent Synthetic event object.
       * @param {Route} current Current route information.
       * @param {Route|Undefined} previous Previous route information, or undefined if current is
       * first route entered.
       */

      /**
       * @ngdoc event
       * @name $route#$routeChangeError
       * @eventType broadcast on root scope
       * @description
       * Broadcasted if any of the resolve promises are rejected.
       *
       * @param {Object} angularEvent Synthetic event object
       * @param {Route} current Current route information.
       * @param {Route} previous Previous route information.
       * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
       */

      /**
       * @ngdoc event
       * @name $route#$routeUpdate
       * @eventType broadcast on root scope
       * @description
       *
       * The `reloadOnSearch` property has been set to false, and we are reusing the same
       * instance of the Controller.
       */

      var forceReload = false,
          $route = {
            routes: routes,

            /**
             * @ngdoc method
             * @name $route#reload
             *
             * @description
             * Causes `$route` service to reload the current route even if
             * {@link ng.$location $location} hasn't changed.
             *
             * As a result of that, {@link ngRoute.directive:ngView ngView}
             * creates new scope, reinstantiates the controller.
             */
            reload: function() {
              forceReload = true;
              $rootScope.$evalAsync(updateRoute);
            }
          };

      $rootScope.$on('$locationChangeSuccess', updateRoute);

      return $route;

      /////////////////////////////////////////////////////

      /**
       * @param on {string} current url
       * @param route {Object} route regexp to match the url against
       * @return {?Object}
       *
       * @description
       * Check if the route matches the current url.
       *
       * Inspired by match in
       * visionmedia/express/lib/router/router.js.
       */
      function switchRouteMatcher(on, route) {
        var keys = route.keys,
            params = {};

        if (!route.regexp) return null;

        var m = route.regexp.exec(on);
        if (!m) return null;

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];

          var val = m[i];

          if (key && val) {
            params[key.name] = val;
          }
        }
        return params;
      }

      function updateRoute() {
        var next = parseRoute(),
            last = $route.current;

        if (next && last && next.$$route === last.$$route
            && angular.equals(next.pathParams, last.pathParams)
            && !next.reloadOnSearch && !forceReload) {
          last.params = next.params;
          angular.copy(last.params, $routeParams);
          $rootScope.$broadcast('$routeUpdate', last);
        } else if (next || last) {
          forceReload = false;
          $rootScope.$broadcast('$routeChangeStart', next, last);
          $route.current = next;
          if (next) {
            if (next.redirectTo) {
              if (angular.isString(next.redirectTo)) {
                $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                         .replace();
              } else {
                $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                         .replace();
              }
            }
          }

          $q.when(next).
            then(function() {
              if (next) {
                var locals = angular.extend({}, next.resolve),
                    template, templateUrl;

                angular.forEach(locals, function(value, key) {
                  locals[key] = angular.isString(value) ?
                      $injector.get(value) : $injector.invoke(value);
                });

                if (angular.isDefined(template = next.template)) {
                  if (angular.isFunction(template)) {
                    template = template(next.params);
                  }
                } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                  if (angular.isFunction(templateUrl)) {
                    templateUrl = templateUrl(next.params);
                  }
                  templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                  if (angular.isDefined(templateUrl)) {
                    next.loadedTemplateUrl = templateUrl;
                    template = $http.get(templateUrl, {cache: $templateCache}).
                        then(function(response) { return response.data; });
                  }
                }
                if (angular.isDefined(template)) {
                  locals['$template'] = template;
                }
                return $q.all(locals);
              }
            }).
            // after route change
            then(function(locals) {
              if (next == $route.current) {
                if (next) {
                  next.locals = locals;
                  angular.copy(next.params, $routeParams);
                }
                $rootScope.$broadcast('$routeChangeSuccess', next, last);
              }
            }, function(error) {
              if (next == $route.current) {
                $rootScope.$broadcast('$routeChangeError', next, last, error);
              }
            });
        }
      }


      /**
       * @returns {Object} the current active route, by matching it against the URL
       */
      function parseRoute() {
        // Match a route
        var params, match;
        angular.forEach(routes, function(route, path) {
          if (!match && (params = switchRouteMatcher($location.path(), route))) {
            match = inherit(route, {
              params: angular.extend({}, $location.search(), params),
              pathParams: params});
            match.$$route = route;
          }
        });
        // No route matched; fallback to "otherwise" route
        return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
      }

      /**
       * @returns {string} interpolation of the redirect path with the parameters
       */
      function interpolate(string, params) {
        var result = [];
        angular.forEach((string||'').split(':'), function(segment, i) {
          if (i === 0) {
            result.push(segment);
          } else {
            var segmentMatch = segment.match(/(\w+)(.*)/);
            var key = segmentMatch[1];
            result.push(params[key]);
            result.push(segmentMatch[2] || '');
            delete params[key];
          }
        });
        return result.join('');
      }
    }];
  }

  ngRouteModule.provider('$routeParams', $RouteParamsProvider);


  /**
   * @ngdoc service
   * @name $routeParams
   * @requires $route
   *
   * @description
   * The `$routeParams` service allows you to retrieve the current set of route parameters.
   *
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   *
   * The route parameters are a combination of {@link ng.$location `$location`}'s
   * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
   * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
   *
   * In case of parameter name collision, `path` params take precedence over `search` params.
   *
   * The service guarantees that the identity of the `$routeParams` object will remain unchanged
   * (but its properties will likely change) even when a route change occurs.
   *
   * Note that the `$routeParams` are only updated *after* a route change completes successfully.
   * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
   * Instead you can use `$route.current.params` to access the new route's parameters.
   *
   * @example
   * ```js
   *  // Given:
   *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
   *  // Route: /Chapter/:chapterId/Section/:sectionId
   *  //
   *  // Then
   *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
   * ```
   */
  function $RouteParamsProvider() {
    this.$get = function() { return {}; };
  }

  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);


  /**
   * @ngdoc directive
   * @name ngView
   * @restrict ECA
   *
   * @description
   * # Overview
   * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
   * including the rendered template of the current route into the main layout (`index.html`) file.
   * Every time the current route changes, the included view changes with it according to the
   * configuration of the `$route` service.
   *
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   *
   * @animations
   * enter - animation is used to bring new content into the browser.
   * leave - animation is used to animate existing content away.
   *
   * The enter and leave animation occur concurrently.
   *
   * @scope
   * @priority 400
   * @param {string=} onload Expression to evaluate whenever the view updates.
   *
   * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
   *                  $anchorScroll} to scroll the viewport after the view is updated.
   *
   *                  - If the attribute is not set, disable scrolling.
   *                  - If the attribute is set without value, enable scrolling.
   *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
   *                    as an expression yields a truthy value.
   * @example
      <example name="ngView-directive" module="ngViewExample"
               deps="angular-route.js;angular-animate.js"
               animations="true" fixBase="true">
        <file name="index.html">
          <div ng-controller="MainCtrl as main">
            Choose:
            <a href="Book/Moby">Moby</a> |
            <a href="Book/Moby/ch/1">Moby: Ch1</a> |
            <a href="Book/Gatsby">Gatsby</a> |
            <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
            <a href="Book/Scarlet">Scarlet Letter</a><br/>

            <div class="view-animate-container">
              <div ng-view class="view-animate"></div>
            </div>
            <hr />

            <pre>$location.path() = {{main.$location.path()}}</pre>
            <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
            <pre>$route.current.params = {{main.$route.current.params}}</pre>
            <pre>$route.current.scope.name = {{main.$route.current.scope.name}}</pre>
            <pre>$routeParams = {{main.$routeParams}}</pre>
          </div>
        </file>

        <file name="book.html">
          <div>
            controller: {{book.name}}<br />
            Book Id: {{book.params.bookId}}<br />
          </div>
        </file>

        <file name="chapter.html">
          <div>
            controller: {{chapter.name}}<br />
            Book Id: {{chapter.params.bookId}}<br />
            Chapter Id: {{chapter.params.chapterId}}
          </div>
        </file>

        <file name="animations.css">
          .view-animate-container {
            position:relative;
            height:100px!important;
            position:relative;
            background:white;
            border:1px solid black;
            height:40px;
            overflow:hidden;
          }

          .view-animate {
            padding:10px;
          }

          .view-animate.ng-enter, .view-animate.ng-leave {
            -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
            transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

            display:block;
            width:100%;
            border-left:1px solid black;

            position:absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
            padding:10px;
          }

          .view-animate.ng-enter {
            left:100%;
          }
          .view-animate.ng-enter.ng-enter-active {
            left:0;
          }
          .view-animate.ng-leave.ng-leave-active {
            left:-100%;
          }
        </file>

        <file name="script.js">
          angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
            .config(['$routeProvider', '$locationProvider',
              function($routeProvider, $locationProvider) {
                $routeProvider
                  .when('/Book/:bookId', {
                    templateUrl: 'book.html',
                    controller: 'BookCtrl',
                    controllerAs: 'book'
                  })
                  .when('/Book/:bookId/ch/:chapterId', {
                    templateUrl: 'chapter.html',
                    controller: 'ChapterCtrl',
                    controllerAs: 'chapter'
                  });

                // configure html5 to get links working on jsfiddle
                $locationProvider.html5Mode(true);
            }])
            .controller('MainCtrl', ['$route', '$routeParams', '$location',
              function($route, $routeParams, $location) {
                this.$route = $route;
                this.$location = $location;
                this.$routeParams = $routeParams;
            }])
            .controller('BookCtrl', ['$routeParams', function($routeParams) {
              this.name = "BookCtrl";
              this.params = $routeParams;
            }])
            .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
              this.name = "ChapterCtrl";
              this.params = $routeParams;
            }]);

        </file>

        <file name="protractor.js" type="protractor">
          it('should load and compile correct template', function() {
            element(by.linkText('Moby: Ch1')).click();
            var content = element(by.css('[ng-view]')).getText();
            expect(content).toMatch(/controller\: ChapterCtrl/);
            expect(content).toMatch(/Book Id\: Moby/);
            expect(content).toMatch(/Chapter Id\: 1/);

            element(by.partialLinkText('Scarlet')).click();

            content = element(by.css('[ng-view]')).getText();
            expect(content).toMatch(/controller\: BookCtrl/);
            expect(content).toMatch(/Book Id\: Scarlet/);
          });
        </file>
      </example>
   */


  /**
   * @ngdoc event
   * @name ngView#$viewContentLoaded
   * @eventType emit on the current ngView scope
   * @description
   * Emitted every time the ngView content is reloaded.
   */
  ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
  function ngViewFactory(   $route,   $anchorScroll,   $animate) {
    return {
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      transclude: 'element',
      link: function(scope, $element, attr, ctrl, $transclude) {
          var currentScope,
              currentElement,
              previousElement,
              autoScrollExp = attr.autoscroll,
              onloadExp = attr.onload || '';

          scope.$on('$routeChangeSuccess', update);
          update();

          function cleanupLastView() {
            if(previousElement) {
              previousElement.remove();
              previousElement = null;
            }
            if(currentScope) {
              currentScope.$destroy();
              currentScope = null;
            }
            if(currentElement) {
              $animate.leave(currentElement, function() {
                previousElement = null;
              });
              previousElement = currentElement;
              currentElement = null;
            }
          }

          function update() {
            var locals = $route.current && $route.current.locals,
                template = locals && locals.$template;

            if (angular.isDefined(template)) {
              var newScope = scope.$new();
              var current = $route.current;

              // Note: This will also link all children of ng-view that were contained in the original
              // html. If that content contains controllers, ... they could pollute/change the scope.
              // However, using ng-view on an element with additional content does not make sense...
              // Note: We can't remove them in the cloneAttchFn of $transclude as that
              // function is called before linking the content, which would apply child
              // directives to non existing elements.
              var clone = $transclude(newScope, function(clone) {
                $animate.enter(clone, null, currentElement || $element, function onNgViewEnter () {
                  if (angular.isDefined(autoScrollExp)
                    && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                    $anchorScroll();
                  }
                });
                cleanupLastView();
              });

              currentElement = clone;
              currentScope = current.scope = newScope;
              currentScope.$emit('$viewContentLoaded');
              currentScope.$eval(onloadExp);
            } else {
              cleanupLastView();
            }
          }
      }
    };
  }

  // This directive is called during the $transclude call of the first `ngView` directive.
  // It will replace and compile the content of the element with the loaded template.
  // We need this directive so that the element content is already filled when
  // the link function of another directive on the same element as ngView
  // is called.
  ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
  function ngViewFillContentFactory($compile, $controller, $route) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function(scope, $element) {
        var current = $route.current,
            locals = current.locals;

        $element.html(locals.$template);

        var link = $compile($element.contents());

        if (current.controller) {
          locals.$scope = scope;
          var controller = $controller(current.controller, locals);
          if (current.controllerAs) {
            scope[current.controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }

        link(scope);
      }
    };
  }


  })(window, window.angular);


}) (angular.module ('ngRoute', ['ng']));



(function (module) {

  /**
   * @license AngularJS v1.2.21
   * (c) 2010-2014 Google, Inc. http://angularjs.org
   * License: MIT
   */
  (function(window, angular, undefined) {'use strict';

  /**
   * @ngdoc module
   * @name ngTouch
   * @description
   *
   * # ngTouch
   *
   * The `ngTouch` module provides touch events and other helpers for touch-enabled devices.
   * The implementation is based on jQuery Mobile touch event handling
   * ([jquerymobile.com](http://jquerymobile.com/)).
   *
   *
   * See {@link ngTouch.$swipe `$swipe`} for usage.
   *
   * <div doc-module-components="ngTouch"></div>
   *
   */

  // define ngTouch module
  /* global -ngTouch */
  var ngTouch = module;

  /* global ngTouch: false */

      /**
       * @ngdoc service
       * @name $swipe
       *
       * @description
       * The `$swipe` service is a service that abstracts the messier details of hold-and-drag swipe
       * behavior, to make implementing swipe-related directives more convenient.
       *
       * Requires the {@link ngTouch `ngTouch`} module to be installed.
       *
       * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`, and by
       * `ngCarousel` in a separate component.
       *
       * # Usage
       * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
       * which is to be watched for swipes, and an object with four handler functions. See the
       * documentation for `bind` below.
       */

  ngTouch.factory('$swipe', [function() {
    // The total distance in any direction before we make the call on swipe vs. scroll.
    var MOVE_BUFFER_RADIUS = 10;

    function getCoordinates(event) {
      var touches = event.touches && event.touches.length ? event.touches : [event];
      var e = (event.changedTouches && event.changedTouches[0]) ||
          (event.originalEvent && event.originalEvent.changedTouches &&
              event.originalEvent.changedTouches[0]) ||
          touches[0].originalEvent || touches[0];

      return {
        x: e.clientX,
        y: e.clientY
      };
    }

    return {
      /**
       * @ngdoc method
       * @name $swipe#bind
       *
       * @description
       * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
       * object containing event handlers.
       *
       * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
       * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }`.
       *
       * `start` is called on either `mousedown` or `touchstart`. After this event, `$swipe` is
       * watching for `touchmove` or `mousemove` events. These events are ignored until the total
       * distance moved in either dimension exceeds a small threshold.
       *
       * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
       * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
       * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
       *   A `cancel` event is sent.
       *
       * `move` is called on `mousemove` and `touchmove` after the above logic has determined that
       * a swipe is in progress.
       *
       * `end` is called when a swipe is successfully completed with a `touchend` or `mouseup`.
       *
       * `cancel` is called either on a `touchcancel` from the browser, or when we begin scrolling
       * as described above.
       *
       */
      bind: function(element, eventHandlers) {
        // Absolute total movement, used to control swipe vs. scroll.
        var totalX, totalY;
        // Coordinates of the start position.
        var startCoords;
        // Last event's position.
        var lastPos;
        // Whether a swipe is active.
        var active = false;

        element.on('touchstart mousedown', function(event) {
          startCoords = getCoordinates(event);
          active = true;
          totalX = 0;
          totalY = 0;
          lastPos = startCoords;
          eventHandlers['start'] && eventHandlers['start'](startCoords, event);
        });

        element.on('touchcancel', function(event) {
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
        });

        element.on('touchmove mousemove', function(event) {
          if (!active) return;

          // Android will send a touchcancel if it thinks we're starting to scroll.
          // So when the total distance (+ or - or both) exceeds 10px in either direction,
          // we either:
          // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
          // - On totalY > totalX, we let the browser handle it as a scroll.

          if (!startCoords) return;
          var coords = getCoordinates(event);

          totalX += Math.abs(coords.x - lastPos.x);
          totalY += Math.abs(coords.y - lastPos.y);

          lastPos = coords;

          if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
            return;
          }

          // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
          if (totalY > totalX) {
            // Allow native scrolling to take over.
            active = false;
            eventHandlers['cancel'] && eventHandlers['cancel'](event);
            return;
          } else {
            // Prevent the browser from scrolling.
            event.preventDefault();
            eventHandlers['move'] && eventHandlers['move'](coords, event);
          }
        });

        element.on('touchend mouseup', function(event) {
          if (!active) return;
          active = false;
          eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
        });
      }
    };
  }]);

  /* global ngTouch: false */

  /**
   * @ngdoc directive
   * @name ngClick
   *
   * @description
   * A more powerful replacement for the default ngClick designed to be used on touchscreen
   * devices. Most mobile browsers wait about 300ms after a tap-and-release before sending
   * the click event. This version handles them immediately, and then prevents the
   * following click event from propagating.
   *
   * Requires the {@link ngTouch `ngTouch`} module to be installed.
   *
   * This directive can fall back to using an ordinary click event, and so works on desktop
   * browsers as well as mobile.
   *
   * This directive also sets the CSS class `ng-click-active` while the element is being held
   * down (by a mouse click or touch) so you can restyle the depressed element if you wish.
   *
   * @element ANY
   * @param {expression} ngClick {@link guide/expression Expression} to evaluate
   * upon tap. (Event object is available as `$event`)
   *
   * @example
      <example module="ngClickExample" deps="angular-touch.js">
        <file name="index.html">
          <button ng-click="count = count + 1" ng-init="count=0">
            Increment
          </button>
          count: {{ count }}
        </file>
        <file name="script.js">
          angular.module('ngClickExample', ['ngTouch']);
        </file>
      </example>
   */

  ngTouch.config(['$provide', function($provide) {
    $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
      // drop the default ngClick directive
      $delegate.shift();
      return $delegate;
    }]);
  }]);

  ngTouch.directive('ngClick', ['$parse', '$timeout', '$rootElement',
      function($parse, $timeout, $rootElement) {
    var TAP_DURATION = 750; // Shorter than 750ms is a tap, longer is a taphold or drag.
    var MOVE_TOLERANCE = 12; // 12px seems to work in most mobile browsers.
    var PREVENT_DURATION = 2500; // 2.5 seconds maximum from preventGhostClick call to click
    var CLICKBUSTER_THRESHOLD = 25; // 25 pixels in any dimension is the limit for busting clicks.

    var ACTIVE_CLASS_NAME = 'ng-click-active';
    var lastPreventedTime;
    var touchCoordinates;
    var lastLabelClickCoordinates;


    // TAP EVENTS AND GHOST CLICKS
    //
    // Why tap events?
    // Mobile browsers detect a tap, then wait a moment (usually ~300ms) to see if you're
    // double-tapping, and then fire a click event.
    //
    // This delay sucks and makes mobile apps feel unresponsive.
    // So we detect touchstart, touchmove, touchcancel and touchend ourselves and determine when
    // the user has tapped on something.
    //
    // What happens when the browser then generates a click event?
    // The browser, of course, also detects the tap and fires a click after a delay. This results in
    // tapping/clicking twice. We do "clickbusting" to prevent it.
    //
    // How does it work?
    // We attach global touchstart and click handlers, that run during the capture (early) phase.
    // So the sequence for a tap is:
    // - global touchstart: Sets an "allowable region" at the point touched.
    // - element's touchstart: Starts a touch
    // (- touchmove or touchcancel ends the touch, no click follows)
    // - element's touchend: Determines if the tap is valid (didn't move too far away, didn't hold
    //   too long) and fires the user's tap handler. The touchend also calls preventGhostClick().
    // - preventGhostClick() removes the allowable region the global touchstart created.
    // - The browser generates a click event.
    // - The global click handler catches the click, and checks whether it was in an allowable region.
    //     - If preventGhostClick was called, the region will have been removed, the click is busted.
    //     - If the region is still there, the click proceeds normally. Therefore clicks on links and
    //       other elements without ngTap on them work normally.
    //
    // This is an ugly, terrible hack!
    // Yeah, tell me about it. The alternatives are using the slow click events, or making our users
    // deal with the ghost clicks, so I consider this the least of evils. Fortunately Angular
    // encapsulates this ugly logic away from the user.
    //
    // Why not just put click handlers on the element?
    // We do that too, just to be sure. If the tap event caused the DOM to change,
    // it is possible another element is now in that position. To take account for these possibly
    // distinct elements, the handlers are global and care only about coordinates.

    // Checks if the coordinates are close enough to be within the region.
    function hit(x1, y1, x2, y2) {
      return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
    }

    // Checks a list of allowable regions against a click location.
    // Returns true if the click should be allowed.
    // Splices out the allowable region from the list after it has been used.
    function checkAllowableRegions(touchCoordinates, x, y) {
      for (var i = 0; i < touchCoordinates.length; i += 2) {
        if (hit(touchCoordinates[i], touchCoordinates[i+1], x, y)) {
          touchCoordinates.splice(i, i + 2);
          return true; // allowable region
        }
      }
      return false; // No allowable region; bust it.
    }

    // Global click handler that prevents the click if it's in a bustable zone and preventGhostClick
    // was called recently.
    function onClick(event) {
      if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
        return; // Too old.
      }

      var touches = event.touches && event.touches.length ? event.touches : [event];
      var x = touches[0].clientX;
      var y = touches[0].clientY;
      // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
      // and on the input element). Depending on the exact browser, this second click we don't want
      // to bust has either (0,0), negative coordinates, or coordinates equal to triggering label
      // click event
      if (x < 1 && y < 1) {
        return; // offscreen
      }
      if (lastLabelClickCoordinates &&
          lastLabelClickCoordinates[0] === x && lastLabelClickCoordinates[1] === y) {
        return; // input click triggered by label click
      }
      // reset label click coordinates on first subsequent click
      if (lastLabelClickCoordinates) {
        lastLabelClickCoordinates = null;
      }
      // remember label click coordinates to prevent click busting of trigger click event on input
      if (event.target.tagName.toLowerCase() === 'label') {
        lastLabelClickCoordinates = [x, y];
      }

      // Look for an allowable region containing this click.
      // If we find one, that means it was created by touchstart and not removed by
      // preventGhostClick, so we don't bust it.
      if (checkAllowableRegions(touchCoordinates, x, y)) {
        return;
      }

      // If we didn't find an allowable region, bust the click.
      event.stopPropagation();
      event.preventDefault();

      // Blur focused form elements
      event.target && event.target.blur();
    }


    // Global touchstart handler that creates an allowable region for a click event.
    // This allowable region can be removed by preventGhostClick if we want to bust it.
    function onTouchStart(event) {
      var touches = event.touches && event.touches.length ? event.touches : [event];
      var x = touches[0].clientX;
      var y = touches[0].clientY;
      touchCoordinates.push(x, y);

      $timeout(function() {
        // Remove the allowable region.
        for (var i = 0; i < touchCoordinates.length; i += 2) {
          if (touchCoordinates[i] == x && touchCoordinates[i+1] == y) {
            touchCoordinates.splice(i, i + 2);
            return;
          }
        }
      }, PREVENT_DURATION, false);
    }

    // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
    // zone around the touchstart where clicks will get busted.
    function preventGhostClick(x, y) {
      if (!touchCoordinates) {
        $rootElement[0].addEventListener('click', onClick, true);
        $rootElement[0].addEventListener('touchstart', onTouchStart, true);
        touchCoordinates = [];
      }

      lastPreventedTime = Date.now();

      checkAllowableRegions(touchCoordinates, x, y);
    }

    // Actual linking function.
    return function(scope, element, attr) {
      var clickHandler = $parse(attr.ngClick),
          tapping = false,
          tapElement,  // Used to blur the element after a tap.
          startTime,   // Used to check if the tap was held too long.
          touchStartX,
          touchStartY;

      function resetState() {
        tapping = false;
        element.removeClass(ACTIVE_CLASS_NAME);
      }

      element.on('touchstart', function(event) {
        tapping = true;
        tapElement = event.target ? event.target : event.srcElement; // IE uses srcElement.
        // Hack for Safari, which can target text nodes instead of containers.
        if(tapElement.nodeType == 3) {
          tapElement = tapElement.parentNode;
        }

        element.addClass(ACTIVE_CLASS_NAME);

        startTime = Date.now();

        var touches = event.touches && event.touches.length ? event.touches : [event];
        var e = touches[0].originalEvent || touches[0];
        touchStartX = e.clientX;
        touchStartY = e.clientY;
      });

      element.on('touchmove', function(event) {
        resetState();
      });

      element.on('touchcancel', function(event) {
        resetState();
      });

      element.on('touchend', function(event) {
        var diff = Date.now() - startTime;

        var touches = (event.changedTouches && event.changedTouches.length) ? event.changedTouches :
            ((event.touches && event.touches.length) ? event.touches : [event]);
        var e = touches[0].originalEvent || touches[0];
        var x = e.clientX;
        var y = e.clientY;
        var dist = Math.sqrt( Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2) );

        if (tapping && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
          // Call preventGhostClick so the clickbuster will catch the corresponding click.
          preventGhostClick(x, y);

          // Blur the focused element (the button, probably) before firing the callback.
          // This doesn't work perfectly on Android Chrome, but seems to work elsewhere.
          // I couldn't get anything to work reliably on Android Chrome.
          if (tapElement) {
            tapElement.blur();
          }

          if (!angular.isDefined(attr.disabled) || attr.disabled === false) {
            element.triggerHandler('click', [event]);
          }
        }

        resetState();
      });

      // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
      // something else nearby.
      element.onclick = function(event) { };

      // Actual click handler.
      // There are three different kinds of clicks, only two of which reach this point.
      // - On desktop browsers without touch events, their clicks will always come here.
      // - On mobile browsers, the simulated "fast" click will call this.
      // - But the browser's follow-up slow click will be "busted" before it reaches this handler.
      // Therefore it's safe to use this directive on both mobile and desktop.
      element.on('click', function(event, touchend) {
        scope.$apply(function() {
          clickHandler(scope, {$event: (touchend || event)});
        });
      });

      element.on('mousedown', function(event) {
        element.addClass(ACTIVE_CLASS_NAME);
      });

      element.on('mousemove mouseup', function(event) {
        element.removeClass(ACTIVE_CLASS_NAME);
      });

    };
  }]);

  /* global ngTouch: false */

  /**
   * @ngdoc directive
   * @name ngSwipeLeft
   *
   * @description
   * Specify custom behavior when an element is swiped to the left on a touchscreen device.
   * A leftward swipe is a quick, right-to-left slide of the finger.
   * Though ngSwipeLeft is designed for touch-based devices, it will work with a mouse click and drag
   * too.
   *
   * Requires the {@link ngTouch `ngTouch`} module to be installed.
   *
   * @element ANY
   * @param {expression} ngSwipeLeft {@link guide/expression Expression} to evaluate
   * upon left swipe. (Event object is available as `$event`)
   *
   * @example
      <example module="ngSwipeLeftExample" deps="angular-touch.js">
        <file name="index.html">
          <div ng-show="!showActions" ng-swipe-left="showActions = true">
            Some list content, like an email in the inbox
          </div>
          <div ng-show="showActions" ng-swipe-right="showActions = false">
            <button ng-click="reply()">Reply</button>
            <button ng-click="delete()">Delete</button>
          </div>
        </file>
        <file name="script.js">
          angular.module('ngSwipeLeftExample', ['ngTouch']);
        </file>
      </example>
   */

  /**
   * @ngdoc directive
   * @name ngSwipeRight
   *
   * @description
   * Specify custom behavior when an element is swiped to the right on a touchscreen device.
   * A rightward swipe is a quick, left-to-right slide of the finger.
   * Though ngSwipeRight is designed for touch-based devices, it will work with a mouse click and drag
   * too.
   *
   * Requires the {@link ngTouch `ngTouch`} module to be installed.
   *
   * @element ANY
   * @param {expression} ngSwipeRight {@link guide/expression Expression} to evaluate
   * upon right swipe. (Event object is available as `$event`)
   *
   * @example
      <example module="ngSwipeRightExample" deps="angular-touch.js">
        <file name="index.html">
          <div ng-show="!showActions" ng-swipe-left="showActions = true">
            Some list content, like an email in the inbox
          </div>
          <div ng-show="showActions" ng-swipe-right="showActions = false">
            <button ng-click="reply()">Reply</button>
            <button ng-click="delete()">Delete</button>
          </div>
        </file>
        <file name="script.js">
          angular.module('ngSwipeRightExample', ['ngTouch']);
        </file>
      </example>
   */

  function makeSwipeDirective(directiveName, direction, eventName) {
    ngTouch.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {
      // The maximum vertical delta for a swipe should be less than 75px.
      var MAX_VERTICAL_DISTANCE = 75;
      // Vertical distance should not be more than a fraction of the horizontal distance.
      var MAX_VERTICAL_RATIO = 0.3;
      // At least a 30px lateral motion is necessary for a swipe.
      var MIN_HORIZONTAL_DISTANCE = 30;

      return function(scope, element, attr) {
        var swipeHandler = $parse(attr[directiveName]);

        var startCoords, valid;

        function validSwipe(coords) {
          // Check that it's within the coordinates.
          // Absolute vertical distance must be within tolerances.
          // Horizontal distance, we take the current X - the starting X.
          // This is negative for leftward swipes and positive for rightward swipes.
          // After multiplying by the direction (-1 for left, +1 for right), legal swipes
          // (ie. same direction as the directive wants) will have a positive delta and
          // illegal ones a negative delta.
          // Therefore this delta must be positive, and larger than the minimum.
          if (!startCoords) return false;
          var deltaY = Math.abs(coords.y - startCoords.y);
          var deltaX = (coords.x - startCoords.x) * direction;
          return valid && // Short circuit for already-invalidated swipes.
              deltaY < MAX_VERTICAL_DISTANCE &&
              deltaX > 0 &&
              deltaX > MIN_HORIZONTAL_DISTANCE &&
              deltaY / deltaX < MAX_VERTICAL_RATIO;
        }

        $swipe.bind(element, {
          'start': function(coords, event) {
            startCoords = coords;
            valid = true;
          },
          'cancel': function(event) {
            valid = false;
          },
          'end': function(coords, event) {
            if (validSwipe(coords)) {
              scope.$apply(function() {
                element.triggerHandler(eventName);
                swipeHandler(scope, {$event: event});
              });
            }
          }
        });
      };
    }]);
  }

  // Left is negative X-coordinate, right is positive.
  makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
  makeSwipeDirective('ngSwipeRight', 1, 'swiperight');



  })(window, window.angular);


}) (angular.module ('ngTouch', []));



(function (module) {

  /**
   * @license AngularJS v1.2.21
   * (c) 2010-2014 Google, Inc. http://angularjs.org
   * License: MIT
   */
  (function(window, angular, undefined) {'use strict';

  /* jshint maxlen: false */

  /**
   * @ngdoc module
   * @name ngAnimate
   * @description
   *
   * # ngAnimate
   *
   * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
   *
   *
   * <div doc-module-components="ngAnimate"></div>
   *
   * # Usage
   *
   * To see animations in action, all that is required is to define the appropriate CSS classes
   * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
   * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
   * by using the `$animate` service.
   *
   * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
   *
   * | Directive                                                 | Supported Animations                               |
   * |---------------------------------------------------------- |----------------------------------------------------|
   * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
   * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
   * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
   * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
   * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
   * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
   * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
   * | {@link ng.directive:form#usage_animations form}                 | add and remove (dirty, pristine, valid, invalid & all other validations)                |
   * | {@link ng.directive:ngModel#usage_animations ngModel}           | add and remove (dirty, pristine, valid, invalid & all other validations)                |
   *
   * You can find out more information about animations upon visiting each directive page.
   *
   * Below is an example of how to apply animations to a directive that supports animation hooks:
   *
   * ```html
   * <style type="text/css">
   * .slide.ng-enter, .slide.ng-leave {
   *   -webkit-transition:0.5s linear all;
   *   transition:0.5s linear all;
   * }
   *
   * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
   * .slide.ng-enter.ng-enter-active { } /&#42; terminal animations for enter &#42;/
   * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
   * .slide.ng-leave.ng-leave-active { } /&#42; terminal animations for leave &#42;/
   * </style>
   *
   * <!--
   * the animate service will automatically add .ng-enter and .ng-leave to the element
   * to trigger the CSS transition/animations
   * -->
   * <ANY class="slide" ng-include="..."></ANY>
   * ```
   *
   * Keep in mind that, by default, if an animation is running, any child elements cannot be animated
   * until the parent element's animation has completed. This blocking feature can be overridden by
   * placing the `ng-animate-children` attribute on a parent container tag.
   *
   * ```html
   * <div class="slide-animation" ng-if="on" ng-animate-children>
   *   <div class="fade-animation" ng-if="on">
   *     <div class="explode-animation" ng-if="on">
   *        ...
   *     </div>
   *   </div>
   * </div>
   * ```
   *
   * When the `on` expression value changes and an animation is triggered then each of the elements within
   * will all animate without the block being applied to child elements.
   *
   * <h2>CSS-defined Animations</h2>
   * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
   * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
   * and can be used to play along with this naming structure.
   *
   * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
   *
   * ```html
   * <style type="text/css">
   * /&#42;
   *  The animate class is apart of the element and the ng-enter class
   *  is attached to the element once the enter animation event is triggered
   * &#42;/
   * .reveal-animation.ng-enter {
   *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
   *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
   *
   *  /&#42; The animation preparation code &#42;/
   *  opacity: 0;
   * }
   *
   * /&#42;
   *  Keep in mind that you want to combine both CSS
   *  classes together to avoid any CSS-specificity
   *  conflicts
   * &#42;/
   * .reveal-animation.ng-enter.ng-enter-active {
   *  /&#42; The animation code itself &#42;/
   *  opacity: 1;
   * }
   * </style>
   *
   * <div class="view-container">
   *   <div ng-view class="reveal-animation"></div>
   * </div>
   * ```
   *
   * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
   *
   * ```html
   * <style type="text/css">
   * .reveal-animation.ng-enter {
   *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
   *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
   * }
   * @-webkit-keyframes enter_sequence {
   *   from { opacity:0; }
   *   to { opacity:1; }
   * }
   * @keyframes enter_sequence {
   *   from { opacity:0; }
   *   to { opacity:1; }
   * }
   * </style>
   *
   * <div class="view-container">
   *   <div ng-view class="reveal-animation"></div>
   * </div>
   * ```
   *
   * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
   *
   * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
   * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
   * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
   * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
   * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
   * has no CSS transition/animation classes applied to it.
   *
   * <h3>CSS Staggering Animations</h3>
   * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
   * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
   * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
   * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
   * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
   *
   * ```css
   * .my-animation.ng-enter {
   *   /&#42; standard transition code &#42;/
   *   -webkit-transition: 1s linear all;
   *   transition: 1s linear all;
   *   opacity:0;
   * }
   * .my-animation.ng-enter-stagger {
   *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
   *   -webkit-transition-delay: 0.1s;
   *   transition-delay: 0.1s;
   *
   *   /&#42; in case the stagger doesn't work then these two values
   *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
   *   -webkit-transition-duration: 0s;
   *   transition-duration: 0s;
   * }
   * .my-animation.ng-enter.ng-enter-active {
   *   /&#42; standard transition styles &#42;/
   *   opacity:1;
   * }
   * ```
   *
   * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
   * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
   * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
   * will also be reset if more than 10ms has passed after the last animation has been fired.
   *
   * The following code will issue the **ng-leave-stagger** event on the element provided:
   *
   * ```js
   * var kids = parent.children();
   *
   * $animate.leave(kids[0]); //stagger index=0
   * $animate.leave(kids[1]); //stagger index=1
   * $animate.leave(kids[2]); //stagger index=2
   * $animate.leave(kids[3]); //stagger index=3
   * $animate.leave(kids[4]); //stagger index=4
   *
   * $timeout(function() {
   *   //stagger has reset itself
   *   $animate.leave(kids[5]); //stagger index=0
   *   $animate.leave(kids[6]); //stagger index=1
   * }, 100, false);
   * ```
   *
   * Stagger animations are currently only supported within CSS-defined animations.
   *
   * <h2>JavaScript-defined Animations</h2>
   * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
   * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
   *
   * ```js
   * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
   * var ngModule = angular.module('YourApp', ['ngAnimate']);
   * ngModule.animation('.my-crazy-animation', function() {
   *   return {
   *     enter: function(element, done) {
   *       //run the animation here and call done when the animation is complete
   *       return function(cancelled) {
   *         //this (optional) function will be called when the animation
   *         //completes or when the animation is cancelled (the cancelled
   *         //flag will be set to true if cancelled).
   *       };
   *     },
   *     leave: function(element, done) { },
   *     move: function(element, done) { },
   *
   *     //animation that can be triggered before the class is added
   *     beforeAddClass: function(element, className, done) { },
   *
   *     //animation that can be triggered after the class is added
   *     addClass: function(element, className, done) { },
   *
   *     //animation that can be triggered before the class is removed
   *     beforeRemoveClass: function(element, className, done) { },
   *
   *     //animation that can be triggered after the class is removed
   *     removeClass: function(element, className, done) { }
   *   };
   * });
   * ```
   *
   * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
   * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
   * the element's CSS class attribute value and then run the matching animation event function (if found).
   * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function will
   * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
   *
   * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
   * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
   * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
   * or transition code that is defined via a stylesheet).
   *
   */

  module

    /**
     * @ngdoc provider
     * @name $animateProvider
     * @description
     *
     * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
     * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
     * the provided name value.
     *
     * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
     *
     * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
     *
     */
    .directive('ngAnimateChildren', function() {
      var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
      return function(scope, element, attrs) {
        var val = attrs.ngAnimateChildren;
        if(angular.isString(val) && val.length === 0) { //empty attribute
          element.data(NG_ANIMATE_CHILDREN, true);
        } else {
          scope.$watch(val, function(value) {
            element.data(NG_ANIMATE_CHILDREN, !!value);
          });
        }
      };
    })

    //this private service is only used within CSS-enabled animations
    //IE8 + IE9 do not support rAF natively, but that is fine since they
    //also don't support transitions and keyframes which means that the code
    //below will never be used by the two browsers.
    .factory('$$animateReflow', ['$$rAF', '$document', function($$rAF, $document) {
      var bod = $document[0].body;
      return function(fn) {
        //the returned function acts as the cancellation function
        return $$rAF(function() {
          //the line below will force the browser to perform a repaint
          //so that all the animated elements within the animation frame
          //will be properly updated and drawn on screen. This is
          //required to perform multi-class CSS based animations with
          //Firefox. DO NOT REMOVE THIS LINE.
          var a = bod.offsetWidth + 1;
          fn();
        });
      };
    }])

    .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
      var noop = angular.noop;
      var forEach = angular.forEach;
      var selectors = $animateProvider.$$selectors;

      var ELEMENT_NODE = 1;
      var NG_ANIMATE_STATE = '$$ngAnimateState';
      var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
      var NG_ANIMATE_CLASS_NAME = 'ng-animate';
      var rootAnimateState = {running: true};

      function extractElementNode(element) {
        for(var i = 0; i < element.length; i++) {
          var elm = element[i];
          if(elm.nodeType == ELEMENT_NODE) {
            return elm;
          }
        }
      }

      function prepareElement(element) {
        return element && angular.element(element);
      }

      function stripCommentsFromElement(element) {
        return angular.element(extractElementNode(element));
      }

      function isMatchingElement(elm1, elm2) {
        return extractElementNode(elm1) == extractElementNode(elm2);
      }

      $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$$asyncCallback', '$rootScope', '$document',
                              function($delegate,   $injector,   $sniffer,   $rootElement,   $$asyncCallback,    $rootScope,   $document) {

        var globalAnimationCounter = 0;
        $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

        // disable animations during bootstrap, but once we bootstrapped, wait again
        // for another digest until enabling animations. The reason why we digest twice
        // is because all structural animations (enter, leave and move) all perform a
        // post digest operation before animating. If we only wait for a single digest
        // to pass then the structural animation would render its animation on page load.
        // (which is what we're trying to avoid when the application first boots up.)
        $rootScope.$$postDigest(function() {
          $rootScope.$$postDigest(function() {
            rootAnimateState.running = false;
          });
        });

        var classNameFilter = $animateProvider.classNameFilter();
        var isAnimatableClassName = !classNameFilter
                ? function() { return true; }
                : function(className) {
                  return classNameFilter.test(className);
                };

        function blockElementAnimations(element) {
          var data = element.data(NG_ANIMATE_STATE) || {};
          data.running = true;
          element.data(NG_ANIMATE_STATE, data);
        }

        function lookup(name) {
          if (name) {
            var matches = [],
                flagMap = {},
                classes = name.substr(1).split('.');

            //the empty string value is the default animation
            //operation which performs CSS transition and keyframe
            //animations sniffing. This is always included for each
            //element animation procedure if the browser supports
            //transitions and/or keyframe animations. The default
            //animation is added to the top of the list to prevent
            //any previous animations from affecting the element styling
            //prior to the element being animated.
            if ($sniffer.transitions || $sniffer.animations) {
              matches.push($injector.get(selectors['']));
            }

            for(var i=0; i < classes.length; i++) {
              var klass = classes[i],
                  selectorFactoryName = selectors[klass];
              if(selectorFactoryName && !flagMap[klass]) {
                matches.push($injector.get(selectorFactoryName));
                flagMap[klass] = true;
              }
            }
            return matches;
          }
        }

        function animationRunner(element, animationEvent, className) {
          //transcluded directives may sometimes fire an animation using only comment nodes
          //best to catch this early on to prevent any animation operations from occurring
          var node = element[0];
          if(!node) {
            return;
          }

          var isSetClassOperation = animationEvent == 'setClass';
          var isClassBased = isSetClassOperation ||
                             animationEvent == 'addClass' ||
                             animationEvent == 'removeClass';

          var classNameAdd, classNameRemove;
          if(angular.isArray(className)) {
            classNameAdd = className[0];
            classNameRemove = className[1];
            className = classNameAdd + ' ' + classNameRemove;
          }

          var currentClassName = element.attr('class');
          var classes = currentClassName + ' ' + className;
          if(!isAnimatableClassName(classes)) {
            return;
          }

          var beforeComplete = noop,
              beforeCancel = [],
              before = [],
              afterComplete = noop,
              afterCancel = [],
              after = [];

          var animationLookup = (' ' + classes).replace(/\s+/g,'.');
          forEach(lookup(animationLookup), function(animationFactory) {
            var created = registerAnimation(animationFactory, animationEvent);
            if(!created && isSetClassOperation) {
              registerAnimation(animationFactory, 'addClass');
              registerAnimation(animationFactory, 'removeClass');
            }
          });

          function registerAnimation(animationFactory, event) {
            var afterFn = animationFactory[event];
            var beforeFn = animationFactory['before' + event.charAt(0).toUpperCase() + event.substr(1)];
            if(afterFn || beforeFn) {
              if(event == 'leave') {
                beforeFn = afterFn;
                //when set as null then animation knows to skip this phase
                afterFn = null;
              }
              after.push({
                event : event, fn : afterFn
              });
              before.push({
                event : event, fn : beforeFn
              });
              return true;
            }
          }

          function run(fns, cancellations, allCompleteFn) {
            var animations = [];
            forEach(fns, function(animation) {
              animation.fn && animations.push(animation);
            });

            var count = 0;
            function afterAnimationComplete(index) {
              if(cancellations) {
                (cancellations[index] || noop)();
                if(++count < animations.length) return;
                cancellations = null;
              }
              allCompleteFn();
            }

            //The code below adds directly to the array in order to work with
            //both sync and async animations. Sync animations are when the done()
            //operation is called right away. DO NOT REFACTOR!
            forEach(animations, function(animation, index) {
              var progress = function() {
                afterAnimationComplete(index);
              };
              switch(animation.event) {
                case 'setClass':
                  cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress));
                  break;
                case 'addClass':
                  cancellations.push(animation.fn(element, classNameAdd || className,     progress));
                  break;
                case 'removeClass':
                  cancellations.push(animation.fn(element, classNameRemove || className,  progress));
                  break;
                default:
                  cancellations.push(animation.fn(element, progress));
                  break;
              }
            });

            if(cancellations && cancellations.length === 0) {
              allCompleteFn();
            }
          }

          return {
            node : node,
            event : animationEvent,
            className : className,
            isClassBased : isClassBased,
            isSetClassOperation : isSetClassOperation,
            before : function(allCompleteFn) {
              beforeComplete = allCompleteFn;
              run(before, beforeCancel, function() {
                beforeComplete = noop;
                allCompleteFn();
              });
            },
            after : function(allCompleteFn) {
              afterComplete = allCompleteFn;
              run(after, afterCancel, function() {
                afterComplete = noop;
                allCompleteFn();
              });
            },
            cancel : function() {
              if(beforeCancel) {
                forEach(beforeCancel, function(cancelFn) {
                  (cancelFn || noop)(true);
                });
                beforeComplete(true);
              }
              if(afterCancel) {
                forEach(afterCancel, function(cancelFn) {
                  (cancelFn || noop)(true);
                });
                afterComplete(true);
              }
            }
          };
        }

        /**
         * @ngdoc service
         * @name $animate
         * @kind function
         *
         * @description
         * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
         * When any of these operations are run, the $animate service
         * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
         * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
         *
         * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
         * will work out of the box without any extra configuration.
         *
         * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
         *
         * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
         *
         */
        return {
          /**
           * @ngdoc method
           * @name $animate#enter
           * @kind function
           *
           * @description
           * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
           * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
           *
           * Below is a breakdown of each step that occurs during enter animation:
           *
           * | Animation Step                                                                               | What the element class attribute looks like |
           * |----------------------------------------------------------------------------------------------|---------------------------------------------|
           * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
           * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
           * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
           * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
           * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
           * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
           * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
           * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
           * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
           * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
           *
           * @param {DOMElement} element the element that will be the focus of the enter animation
           * @param {DOMElement} parentElement the parent element of the element that will be the focus of the enter animation
           * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
           * @param {function()=} doneCallback the callback function that will be called once the animation is complete
          */
          enter : function(element, parentElement, afterElement, doneCallback) {
            element = angular.element(element);
            parentElement = prepareElement(parentElement);
            afterElement = prepareElement(afterElement);

            blockElementAnimations(element);
            $delegate.enter(element, parentElement, afterElement);
            $rootScope.$$postDigest(function() {
              element = stripCommentsFromElement(element);
              performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
            });
          },

          /**
           * @ngdoc method
           * @name $animate#leave
           * @kind function
           *
           * @description
           * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
           * the animation is started, the following CSS classes will be added for the duration of the animation:
           *
           * Below is a breakdown of each step that occurs during leave animation:
           *
           * | Animation Step                                                                               | What the element class attribute looks like |
           * |----------------------------------------------------------------------------------------------|---------------------------------------------|
           * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
           * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
           * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
           * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
           * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
           * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
           * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
           * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
           * | 9. The element is removed from the DOM                                                       | ...                                         |
           * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
           *
           * @param {DOMElement} element the element that will be the focus of the leave animation
           * @param {function()=} doneCallback the callback function that will be called once the animation is complete
          */
          leave : function(element, doneCallback) {
            element = angular.element(element);
            cancelChildAnimations(element);
            blockElementAnimations(element);
            $rootScope.$$postDigest(function() {
              performAnimation('leave', 'ng-leave', stripCommentsFromElement(element), null, null, function() {
                $delegate.leave(element);
              }, doneCallback);
            });
          },

          /**
           * @ngdoc method
           * @name $animate#move
           * @kind function
           *
           * @description
           * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
           * add the element directly after the afterElement element if present. Then the move animation will be run. Once
           * the animation is started, the following CSS classes will be added for the duration of the animation:
           *
           * Below is a breakdown of each step that occurs during move animation:
           *
           * | Animation Step                                                                               | What the element class attribute looks like |
           * |----------------------------------------------------------------------------------------------|---------------------------------------------|
           * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
           * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
           * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
           * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
           * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
           * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
           * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
           * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
           * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
           * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
           *
           * @param {DOMElement} element the element that will be the focus of the move animation
           * @param {DOMElement} parentElement the parentElement element of the element that will be the focus of the move animation
           * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
           * @param {function()=} doneCallback the callback function that will be called once the animation is complete
          */
          move : function(element, parentElement, afterElement, doneCallback) {
            element = angular.element(element);
            parentElement = prepareElement(parentElement);
            afterElement = prepareElement(afterElement);

            cancelChildAnimations(element);
            blockElementAnimations(element);
            $delegate.move(element, parentElement, afterElement);
            $rootScope.$$postDigest(function() {
              element = stripCommentsFromElement(element);
              performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
            });
          },

          /**
           * @ngdoc method
           * @name $animate#addClass
           *
           * @description
           * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
           * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
           * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
           * or keyframes are defined on the -add or base CSS class).
           *
           * Below is a breakdown of each step that occurs during addClass animation:
           *
           * | Animation Step                                                                                 | What the element class attribute looks like |
           * |------------------------------------------------------------------------------------------------|---------------------------------------------|
           * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
           * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
           * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
           * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
           * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
           * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
           * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super super-add super-add-active"  |
           * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
           * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
           * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
           *
           * @param {DOMElement} element the element that will be animated
           * @param {string} className the CSS class that will be added to the element and then animated
           * @param {function()=} doneCallback the callback function that will be called once the animation is complete
          */
          addClass : function(element, className, doneCallback) {
            element = angular.element(element);
            element = stripCommentsFromElement(element);
            performAnimation('addClass', className, element, null, null, function() {
              $delegate.addClass(element, className);
            }, doneCallback);
          },

          /**
           * @ngdoc method
           * @name $animate#removeClass
           *
           * @description
           * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
           * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
           * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
           * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
           *
           * Below is a breakdown of each step that occurs during removeClass animation:
           *
           * | Animation Step                                                                                | What the element class attribute looks like     |
           * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
           * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
           * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
           * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
           * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
           * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
           * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
           * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
           * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
           * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
           *
           *
           * @param {DOMElement} element the element that will be animated
           * @param {string} className the CSS class that will be animated and then removed from the element
           * @param {function()=} doneCallback the callback function that will be called once the animation is complete
          */
          removeClass : function(element, className, doneCallback) {
            element = angular.element(element);
            element = stripCommentsFromElement(element);
            performAnimation('removeClass', className, element, null, null, function() {
              $delegate.removeClass(element, className);
            }, doneCallback);
          },

            /**
             *
             * @ngdoc function
             * @name $animate#setClass
             * @function
             * @description Adds and/or removes the given CSS classes to and from the element.
             * Once complete, the done() callback will be fired (if provided).
             * @param {DOMElement} element the element which will its CSS classes changed
             *   removed from it
             * @param {string} add the CSS classes which will be added to the element
             * @param {string} remove the CSS class which will be removed from the element
             * @param {Function=} done the callback function (if provided) that will be fired after the
             *   CSS classes have been set on the element
             */
          setClass : function(element, add, remove, doneCallback) {
            element = angular.element(element);
            element = stripCommentsFromElement(element);
            performAnimation('setClass', [add, remove], element, null, null, function() {
              $delegate.setClass(element, add, remove);
            }, doneCallback);
          },

          /**
           * @ngdoc method
           * @name $animate#enabled
           * @kind function
           *
           * @param {boolean=} value If provided then set the animation on or off.
           * @param {DOMElement=} element If provided then the element will be used to represent the enable/disable operation
           * @return {boolean} Current animation state.
           *
           * @description
           * Globally enables/disables animations.
           *
          */
          enabled : function(value, element) {
            switch(arguments.length) {
              case 2:
                if(value) {
                  cleanup(element);
                } else {
                  var data = element.data(NG_ANIMATE_STATE) || {};
                  data.disabled = true;
                  element.data(NG_ANIMATE_STATE, data);
                }
              break;

              case 1:
                rootAnimateState.disabled = !value;
              break;

              default:
                value = !rootAnimateState.disabled;
              break;
            }
            return !!value;
           }
        };

        /*
          all animations call this shared animation triggering function internally.
          The animationEvent variable refers to the JavaScript animation event that will be triggered
          and the className value is the name of the animation that will be applied within the
          CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
          and the onComplete callback will be fired once the animation is fully complete.
        */
        function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {

          var runner = animationRunner(element, animationEvent, className);
          if(!runner) {
            fireDOMOperation();
            fireBeforeCallbackAsync();
            fireAfterCallbackAsync();
            closeAnimation();
            return;
          }

          className = runner.className;
          var elementEvents = angular.element._data(runner.node);
          elementEvents = elementEvents && elementEvents.events;

          if (!parentElement) {
            parentElement = afterElement ? afterElement.parent() : element.parent();
          }

          var ngAnimateState  = element.data(NG_ANIMATE_STATE) || {};
          var runningAnimations     = ngAnimateState.active || {};
          var totalActiveAnimations = ngAnimateState.totalActive || 0;
          var lastAnimation         = ngAnimateState.last;

          //only allow animations if the currently running animation is not structural
          //or if there is no animation running at all
          var skipAnimations;
          if (runner.isClassBased) {
            skipAnimations = ngAnimateState.running ||
                             ngAnimateState.disabled ||
                             (lastAnimation && !lastAnimation.isClassBased);
          }

          //skip the animation if animations are disabled, a parent is already being animated,
          //the element is not currently attached to the document body or then completely close
          //the animation if any matching animations are not found at all.
          //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case an animation was found.
          if (skipAnimations || animationsDisabled(element, parentElement)) {
            fireDOMOperation();
            fireBeforeCallbackAsync();
            fireAfterCallbackAsync();
            closeAnimation();
            return;
          }

          var skipAnimation = false;
          if(totalActiveAnimations > 0) {
            var animationsToCancel = [];
            if(!runner.isClassBased) {
              if(animationEvent == 'leave' && runningAnimations['ng-leave']) {
                skipAnimation = true;
              } else {
                //cancel all animations when a structural animation takes place
                for(var klass in runningAnimations) {
                  animationsToCancel.push(runningAnimations[klass]);
                  cleanup(element, klass);
                }
                runningAnimations = {};
                totalActiveAnimations = 0;
              }
            } else if(lastAnimation.event == 'setClass') {
              animationsToCancel.push(lastAnimation);
              cleanup(element, className);
            }
            else if(runningAnimations[className]) {
              var current = runningAnimations[className];
              if(current.event == animationEvent) {
                skipAnimation = true;
              } else {
                animationsToCancel.push(current);
                cleanup(element, className);
              }
            }

            if(animationsToCancel.length > 0) {
              forEach(animationsToCancel, function(operation) {
                operation.cancel();
              });
            }
          }

          if(runner.isClassBased && !runner.isSetClassOperation && !skipAnimation) {
            skipAnimation = (animationEvent == 'addClass') == element.hasClass(className); //opposite of XOR
          }

          if(skipAnimation) {
            fireDOMOperation();
            fireBeforeCallbackAsync();
            fireAfterCallbackAsync();
            fireDoneCallbackAsync();
            return;
          }

          if(animationEvent == 'leave') {
            //there's no need to ever remove the listener since the element
            //will be removed (destroyed) after the leave animation ends or
            //is cancelled midway
            element.one('$destroy', function(e) {
              var element = angular.element(this);
              var state = element.data(NG_ANIMATE_STATE);
              if(state) {
                var activeLeaveAnimation = state.active['ng-leave'];
                if(activeLeaveAnimation) {
                  activeLeaveAnimation.cancel();
                  cleanup(element, 'ng-leave');
                }
              }
            });
          }

          //the ng-animate class does nothing, but it's here to allow for
          //parent animations to find and cancel child animations when needed
          element.addClass(NG_ANIMATE_CLASS_NAME);

          var localAnimationCount = globalAnimationCounter++;
          totalActiveAnimations++;
          runningAnimations[className] = runner;

          element.data(NG_ANIMATE_STATE, {
            last : runner,
            active : runningAnimations,
            index : localAnimationCount,
            totalActive : totalActiveAnimations
          });

          //first we run the before animations and when all of those are complete
          //then we perform the DOM operation and run the next set of animations
          fireBeforeCallbackAsync();
          runner.before(function(cancelled) {
            var data = element.data(NG_ANIMATE_STATE);
            cancelled = cancelled ||
                          !data || !data.active[className] ||
                          (runner.isClassBased && data.active[className].event != animationEvent);

            fireDOMOperation();
            if(cancelled === true) {
              closeAnimation();
            } else {
              fireAfterCallbackAsync();
              runner.after(closeAnimation);
            }
          });

          function fireDOMCallback(animationPhase) {
            var eventName = '$animate:' + animationPhase;
            if(elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
              $$asyncCallback(function() {
                element.triggerHandler(eventName, {
                  event : animationEvent,
                  className : className
                });
              });
            }
          }

          function fireBeforeCallbackAsync() {
            fireDOMCallback('before');
          }

          function fireAfterCallbackAsync() {
            fireDOMCallback('after');
          }

          function fireDoneCallbackAsync() {
            fireDOMCallback('close');
            if(doneCallback) {
              $$asyncCallback(function() {
                doneCallback();
              });
            }
          }

          //it is less complicated to use a flag than managing and canceling
          //timeouts containing multiple callbacks.
          function fireDOMOperation() {
            if(!fireDOMOperation.hasBeenRun) {
              fireDOMOperation.hasBeenRun = true;
              domOperation();
            }
          }

          function closeAnimation() {
            if(!closeAnimation.hasBeenRun) {
              closeAnimation.hasBeenRun = true;
              var data = element.data(NG_ANIMATE_STATE);
              if(data) {
                /* only structural animations wait for reflow before removing an
                   animation, but class-based animations don't. An example of this
                   failing would be when a parent HTML tag has a ng-class attribute
                   causing ALL directives below to skip animations during the digest */
                if(runner && runner.isClassBased) {
                  cleanup(element, className);
                } else {
                  $$asyncCallback(function() {
                    var data = element.data(NG_ANIMATE_STATE) || {};
                    if(localAnimationCount == data.index) {
                      cleanup(element, className, animationEvent);
                    }
                  });
                  element.data(NG_ANIMATE_STATE, data);
                }
              }
              fireDoneCallbackAsync();
            }
          }
        }

        function cancelChildAnimations(element) {
          var node = extractElementNode(element);
          if (node) {
            var nodes = angular.isFunction(node.getElementsByClassName) ?
              node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) :
              node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME);
            forEach(nodes, function(element) {
              element = angular.element(element);
              var data = element.data(NG_ANIMATE_STATE);
              if(data && data.active) {
                forEach(data.active, function(runner) {
                  runner.cancel();
                });
              }
            });
          }
        }

        function cleanup(element, className) {
          if(isMatchingElement(element, $rootElement)) {
            if(!rootAnimateState.disabled) {
              rootAnimateState.running = false;
              rootAnimateState.structural = false;
            }
          } else if(className) {
            var data = element.data(NG_ANIMATE_STATE) || {};

            var removeAnimations = className === true;
            if(!removeAnimations && data.active && data.active[className]) {
              data.totalActive--;
              delete data.active[className];
            }

            if(removeAnimations || !data.totalActive) {
              element.removeClass(NG_ANIMATE_CLASS_NAME);
              element.removeData(NG_ANIMATE_STATE);
            }
          }
        }

        function animationsDisabled(element, parentElement) {
          if (rootAnimateState.disabled) {
            return true;
          }

          if (isMatchingElement(element, $rootElement)) {
            return rootAnimateState.running;
          }

          var allowChildAnimations, parentRunningAnimation, hasParent;
          do {
            //the element did not reach the root element which means that it
            //is not apart of the DOM. Therefore there is no reason to do
            //any animations on it
            if (parentElement.length === 0) break;

            var isRoot = isMatchingElement(parentElement, $rootElement);
            var state = isRoot ? rootAnimateState : (parentElement.data(NG_ANIMATE_STATE) || {});
            if (state.disabled) {
              return true;
            }

            //no matter what, for an animation to work it must reach the root element
            //this implies that the element is attached to the DOM when the animation is run
            if (isRoot) {
              hasParent = true;
            }

            //once a flag is found that is strictly false then everything before
            //it will be discarded and all child animations will be restricted
            if (allowChildAnimations !== false) {
              var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
              if(angular.isDefined(animateChildrenFlag)) {
                allowChildAnimations = animateChildrenFlag;
              }
            }

            parentRunningAnimation = parentRunningAnimation ||
                                     state.running ||
                                     (state.last && !state.last.isClassBased);
          }
          while(parentElement = parentElement.parent());

          return !hasParent || (!allowChildAnimations && parentRunningAnimation);
        }
      }]);

      $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow',
                             function($window,   $sniffer,   $timeout,   $$animateReflow) {
        // Detect proper transitionend/animationend event names.
        var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

        // If unprefixed events are not supported but webkit-prefixed are, use the latter.
        // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
        // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
        // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
        // Register both events in case `window.onanimationend` is not supported because of that,
        // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
        // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
        // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
        if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
          CSS_PREFIX = '-webkit-';
          TRANSITION_PROP = 'WebkitTransition';
          TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
        } else {
          TRANSITION_PROP = 'transition';
          TRANSITIONEND_EVENT = 'transitionend';
        }

        if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
          CSS_PREFIX = '-webkit-';
          ANIMATION_PROP = 'WebkitAnimation';
          ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
        } else {
          ANIMATION_PROP = 'animation';
          ANIMATIONEND_EVENT = 'animationend';
        }

        var DURATION_KEY = 'Duration';
        var PROPERTY_KEY = 'Property';
        var DELAY_KEY = 'Delay';
        var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
        var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
        var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
        var NG_ANIMATE_BLOCK_CLASS_NAME = 'ng-animate-block-transitions';
        var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
        var CLOSING_TIME_BUFFER = 1.5;
        var ONE_SECOND = 1000;

        var lookupCache = {};
        var parentCounter = 0;
        var animationReflowQueue = [];
        var cancelAnimationReflow;
        function afterReflow(element, callback) {
          if(cancelAnimationReflow) {
            cancelAnimationReflow();
          }
          animationReflowQueue.push(callback);
          cancelAnimationReflow = $$animateReflow(function() {
            forEach(animationReflowQueue, function(fn) {
              fn();
            });

            animationReflowQueue = [];
            cancelAnimationReflow = null;
            lookupCache = {};
          });
        }

        var closingTimer = null;
        var closingTimestamp = 0;
        var animationElementQueue = [];
        function animationCloseHandler(element, totalTime) {
          var node = extractElementNode(element);
          element = angular.element(node);

          //this item will be garbage collected by the closing
          //animation timeout
          animationElementQueue.push(element);

          //but it may not need to cancel out the existing timeout
          //if the timestamp is less than the previous one
          var futureTimestamp = Date.now() + totalTime;
          if(futureTimestamp <= closingTimestamp) {
            return;
          }

          $timeout.cancel(closingTimer);

          closingTimestamp = futureTimestamp;
          closingTimer = $timeout(function() {
            closeAllAnimations(animationElementQueue);
            animationElementQueue = [];
          }, totalTime, false);
        }

        function closeAllAnimations(elements) {
          forEach(elements, function(element) {
            var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
            if(elementData) {
              (elementData.closeAnimationFn || noop)();
            }
          });
        }

        function getElementAnimationDetails(element, cacheKey) {
          var data = cacheKey ? lookupCache[cacheKey] : null;
          if(!data) {
            var transitionDuration = 0;
            var transitionDelay = 0;
            var animationDuration = 0;
            var animationDelay = 0;
            var transitionDelayStyle;
            var animationDelayStyle;
            var transitionDurationStyle;
            var transitionPropertyStyle;

            //we want all the styles defined before and after
            forEach(element, function(element) {
              if (element.nodeType == ELEMENT_NODE) {
                var elementStyles = $window.getComputedStyle(element) || {};

                transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

                transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

                transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

                transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

                transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

                animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

                animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

                var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

                if(aDuration > 0) {
                  aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
                }

                animationDuration = Math.max(aDuration, animationDuration);
              }
            });
            data = {
              total : 0,
              transitionPropertyStyle: transitionPropertyStyle,
              transitionDurationStyle: transitionDurationStyle,
              transitionDelayStyle: transitionDelayStyle,
              transitionDelay: transitionDelay,
              transitionDuration: transitionDuration,
              animationDelayStyle: animationDelayStyle,
              animationDelay: animationDelay,
              animationDuration: animationDuration
            };
            if(cacheKey) {
              lookupCache[cacheKey] = data;
            }
          }
          return data;
        }

        function parseMaxTime(str) {
          var maxValue = 0;
          var values = angular.isString(str) ?
            str.split(/\s*,\s*/) :
            [];
          forEach(values, function(value) {
            maxValue = Math.max(parseFloat(value) || 0, maxValue);
          });
          return maxValue;
        }

        function getCacheKey(element) {
          var parentElement = element.parent();
          var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
          if(!parentID) {
            parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
            parentID = parentCounter;
          }
          return parentID + '-' + extractElementNode(element).getAttribute('class');
        }

        function animateSetup(animationEvent, element, className, calculationDecorator) {
          var cacheKey = getCacheKey(element);
          var eventCacheKey = cacheKey + ' ' + className;
          var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

          var stagger = {};
          if(itemIndex > 0) {
            var staggerClassName = className + '-stagger';
            var staggerCacheKey = cacheKey + ' ' + staggerClassName;
            var applyClasses = !lookupCache[staggerCacheKey];

            applyClasses && element.addClass(staggerClassName);

            stagger = getElementAnimationDetails(element, staggerCacheKey);

            applyClasses && element.removeClass(staggerClassName);
          }

          /* the animation itself may need to add/remove special CSS classes
           * before calculating the anmation styles */
          calculationDecorator = calculationDecorator ||
                                 function(fn) { return fn(); };

          element.addClass(className);

          var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};

          var timings = calculationDecorator(function() {
            return getElementAnimationDetails(element, eventCacheKey);
          });

          var transitionDuration = timings.transitionDuration;
          var animationDuration = timings.animationDuration;
          if(transitionDuration === 0 && animationDuration === 0) {
            element.removeClass(className);
            return false;
          }

          element.data(NG_ANIMATE_CSS_DATA_KEY, {
            running : formerData.running || 0,
            itemIndex : itemIndex,
            stagger : stagger,
            timings : timings,
            closeAnimationFn : noop
          });

          //temporarily disable the transition so that the enter styles
          //don't animate twice (this is here to avoid a bug in Chrome/FF).
          var isCurrentlyAnimating = formerData.running > 0 || animationEvent == 'setClass';
          if(transitionDuration > 0) {
            blockTransitions(element, className, isCurrentlyAnimating);
          }

          //staggering keyframe animations work by adjusting the `animation-delay` CSS property
          //on the given element, however, the delay value can only calculated after the reflow
          //since by that time $animate knows how many elements are being animated. Therefore,
          //until the reflow occurs the element needs to be blocked (where the keyframe animation
          //is set to `none 0s`). This blocking mechanism should only be set for when a stagger
          //animation is detected and when the element item index is greater than 0.
          if(animationDuration > 0 && stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            blockKeyframeAnimations(element);
          }

          return true;
        }

        function isStructuralAnimation(className) {
          return className == 'ng-enter' || className == 'ng-move' || className == 'ng-leave';
        }

        function blockTransitions(element, className, isAnimating) {
          if(isStructuralAnimation(className) || !isAnimating) {
            extractElementNode(element).style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
          } else {
            element.addClass(NG_ANIMATE_BLOCK_CLASS_NAME);
          }
        }

        function blockKeyframeAnimations(element) {
          extractElementNode(element).style[ANIMATION_PROP] = 'none 0s';
        }

        function unblockTransitions(element, className) {
          var prop = TRANSITION_PROP + PROPERTY_KEY;
          var node = extractElementNode(element);
          if(node.style[prop] && node.style[prop].length > 0) {
            node.style[prop] = '';
          }
          element.removeClass(NG_ANIMATE_BLOCK_CLASS_NAME);
        }

        function unblockKeyframeAnimations(element) {
          var prop = ANIMATION_PROP;
          var node = extractElementNode(element);
          if(node.style[prop] && node.style[prop].length > 0) {
            node.style[prop] = '';
          }
        }

        function animateRun(animationEvent, element, className, activeAnimationComplete) {
          var node = extractElementNode(element);
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if(node.getAttribute('class').indexOf(className) == -1 || !elementData) {
            activeAnimationComplete();
            return;
          }

          var activeClassName = '';
          forEach(className.split(' '), function(klass, i) {
            activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
          });

          var stagger = elementData.stagger;
          var timings = elementData.timings;
          var itemIndex = elementData.itemIndex;
          var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
          var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
          var maxDelayTime = maxDelay * ONE_SECOND;

          var startTime = Date.now();
          var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;

          var style = '', appliedStyles = [];
          if(timings.transitionDuration > 0) {
            var propertyStyle = timings.transitionPropertyStyle;
            if(propertyStyle.indexOf('all') == -1) {
              style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ';';
              style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ';';
              appliedStyles.push(CSS_PREFIX + 'transition-property');
              appliedStyles.push(CSS_PREFIX + 'transition-duration');
            }
          }

          if(itemIndex > 0) {
            if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
              var delayStyle = timings.transitionDelayStyle;
              style += CSS_PREFIX + 'transition-delay: ' +
                       prepareStaggerDelay(delayStyle, stagger.transitionDelay, itemIndex) + '; ';
              appliedStyles.push(CSS_PREFIX + 'transition-delay');
            }

            if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
              style += CSS_PREFIX + 'animation-delay: ' +
                       prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, itemIndex) + '; ';
              appliedStyles.push(CSS_PREFIX + 'animation-delay');
            }
          }

          if(appliedStyles.length > 0) {
            //the element being animated may sometimes contain comment nodes in
            //the jqLite object, so we're safe to use a single variable to house
            //the styles since there is always only one element being animated
            var oldStyle = node.getAttribute('style') || '';
            node.setAttribute('style', oldStyle + '; ' + style);
          }

          element.on(css3AnimationEvents, onAnimationProgress);
          element.addClass(activeClassName);
          elementData.closeAnimationFn = function() {
            onEnd();
            activeAnimationComplete();
          };

          var staggerTime       = itemIndex * (Math.max(stagger.animationDelay, stagger.transitionDelay) || 0);
          var animationTime     = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
          var totalTime         = (staggerTime + animationTime) * ONE_SECOND;

          elementData.running++;
          animationCloseHandler(element, totalTime);
          return onEnd;

          // This will automatically be called by $animate so
          // there is no need to attach this internally to the
          // timeout done method.
          function onEnd(cancelled) {
            element.off(css3AnimationEvents, onAnimationProgress);
            element.removeClass(activeClassName);
            animateClose(element, className);
            var node = extractElementNode(element);
            for (var i in appliedStyles) {
              node.style.removeProperty(appliedStyles[i]);
            }
          }

          function onAnimationProgress(event) {
            event.stopPropagation();
            var ev = event.originalEvent || event;
            var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();

            /* Firefox (or possibly just Gecko) likes to not round values up
             * when a ms measurement is used for the animation */
            var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

            /* $manualTimeStamp is a mocked timeStamp value which is set
             * within browserTrigger(). This is only here so that tests can
             * mock animations properly. Real events fallback to event.timeStamp,
             * or, if they don't, then a timeStamp is automatically created for them.
             * We're checking to see if the timeStamp surpasses the expected delay,
             * but we're using elapsedTime instead of the timeStamp on the 2nd
             * pre-condition since animations sometimes close off early */
            if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
              activeAnimationComplete();
            }
          }
        }

        function prepareStaggerDelay(delayStyle, staggerDelay, index) {
          var style = '';
          forEach(delayStyle.split(','), function(val, i) {
            style += (i > 0 ? ',' : '') +
                     (index * staggerDelay + parseInt(val, 10)) + 's';
          });
          return style;
        }

        function animateBefore(animationEvent, element, className, calculationDecorator) {
          if(animateSetup(animationEvent, element, className, calculationDecorator)) {
            return function(cancelled) {
              cancelled && animateClose(element, className);
            };
          }
        }

        function animateAfter(animationEvent, element, className, afterAnimationComplete) {
          if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
            return animateRun(animationEvent, element, className, afterAnimationComplete);
          } else {
            animateClose(element, className);
            afterAnimationComplete();
          }
        }

        function animate(animationEvent, element, className, animationComplete) {
          //If the animateSetup function doesn't bother returning a
          //cancellation function then it means that there is no animation
          //to perform at all
          var preReflowCancellation = animateBefore(animationEvent, element, className);
          if(!preReflowCancellation) {
            animationComplete();
            return;
          }

          //There are two cancellation functions: one is before the first
          //reflow animation and the second is during the active state
          //animation. The first function will take care of removing the
          //data from the element which will not make the 2nd animation
          //happen in the first place
          var cancel = preReflowCancellation;
          afterReflow(element, function() {
            unblockTransitions(element, className);
            unblockKeyframeAnimations(element);
            //once the reflow is complete then we point cancel to
            //the new cancellation function which will remove all of the
            //animation properties from the active animation
            cancel = animateAfter(animationEvent, element, className, animationComplete);
          });

          return function(cancelled) {
            (cancel || noop)(cancelled);
          };
        }

        function animateClose(element, className) {
          element.removeClass(className);
          var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if(data) {
            if(data.running) {
              data.running--;
            }
            if(!data.running || data.running === 0) {
              element.removeData(NG_ANIMATE_CSS_DATA_KEY);
            }
          }
        }

        return {
          enter : function(element, animationCompleted) {
            return animate('enter', element, 'ng-enter', animationCompleted);
          },

          leave : function(element, animationCompleted) {
            return animate('leave', element, 'ng-leave', animationCompleted);
          },

          move : function(element, animationCompleted) {
            return animate('move', element, 'ng-move', animationCompleted);
          },

          beforeSetClass : function(element, add, remove, animationCompleted) {
            var className = suffixClasses(remove, '-remove') + ' ' +
                            suffixClasses(add, '-add');
            var cancellationMethod = animateBefore('setClass', element, className, function(fn) {
              /* when classes are removed from an element then the transition style
               * that is applied is the transition defined on the element without the
               * CSS class being there. This is how CSS3 functions outside of ngAnimate.
               * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
              var klass = element.attr('class');
              element.removeClass(remove);
              element.addClass(add);
              var timings = fn();
              element.attr('class', klass);
              return timings;
            });

            if(cancellationMethod) {
              afterReflow(element, function() {
                unblockTransitions(element, className);
                unblockKeyframeAnimations(element);
                animationCompleted();
              });
              return cancellationMethod;
            }
            animationCompleted();
          },

          beforeAddClass : function(element, className, animationCompleted) {
            var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), function(fn) {

              /* when a CSS class is added to an element then the transition style that
               * is applied is the transition defined on the element when the CSS class
               * is added at the time of the animation. This is how CSS3 functions
               * outside of ngAnimate. */
              element.addClass(className);
              var timings = fn();
              element.removeClass(className);
              return timings;
            });

            if(cancellationMethod) {
              afterReflow(element, function() {
                unblockTransitions(element, className);
                unblockKeyframeAnimations(element);
                animationCompleted();
              });
              return cancellationMethod;
            }
            animationCompleted();
          },

          setClass : function(element, add, remove, animationCompleted) {
            remove = suffixClasses(remove, '-remove');
            add = suffixClasses(add, '-add');
            var className = remove + ' ' + add;
            return animateAfter('setClass', element, className, animationCompleted);
          },

          addClass : function(element, className, animationCompleted) {
            return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted);
          },

          beforeRemoveClass : function(element, className, animationCompleted) {
            var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), function(fn) {
              /* when classes are removed from an element then the transition style
               * that is applied is the transition defined on the element without the
               * CSS class being there. This is how CSS3 functions outside of ngAnimate.
               * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
              var klass = element.attr('class');
              element.removeClass(className);
              var timings = fn();
              element.attr('class', klass);
              return timings;
            });

            if(cancellationMethod) {
              afterReflow(element, function() {
                unblockTransitions(element, className);
                unblockKeyframeAnimations(element);
                animationCompleted();
              });
              return cancellationMethod;
            }
            animationCompleted();
          },

          removeClass : function(element, className, animationCompleted) {
            return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted);
          }
        };

        function suffixClasses(classes, suffix) {
          var className = '';
          classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
          forEach(classes, function(klass, i) {
            if(klass && klass.length > 0) {
              className += (i > 0 ? ' ' : '') + klass + suffix;
            }
          });
          return className;
        }
      }]);
    }]);


  })(window, window.angular);


}) (angular.module ('ngAnimate', ['ng']));



(function (module) {

  'use strict';

	var screen = module;

	screen.controller('ScreenCtrl', ['$scope', '$swipe', '$route',
		function ($scope, $swipe, $route) {
			var self = this;

			self.screenStyle = {
				'margin-left': '0px'
			};

			self.setActive = function (menu) {
				var menuItem = $route.current.params.menuItem;

				for ( var i = 0; i < menu.length; i++ ) {
					if (  menu[i].url === menuItem ) {
						switch (i) {
							case 0:
								menu.unshift(menu.pop());
								break;
							case 1:
								break;
							default:
								menu.concat(menu.splice(0, i));
								break;
						}

						break;
					}
				}
			}

			self.onSwipe = function (element, callback) {
				var start;

				element['swipe'] = true;

				$swipe.bind(element, {
					start: function(coords) {
						start = coords;
						( callback[0] ) && callback[0](start, coords);
					},
					move: function (coords) {
						if ( element['swipe'] ) {
							( callback[0] ) && callback[0](start, coords);
						}
					},
					end: function (coords) {
						if ( element['swipe'] ) {
							( callback[1] ) && callback[1](start, coords);
						}
					},
					cancel: function (coords) {

					}
				});				
			}

			self.offSwipe = function (element) {
				element['swipe'] = false;
			}
		}
	]);

	screen.directive('screenWrapper', function () {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			templateUrl: 'templates/screen.html',
			scope: {
				menu: '=',
				ctrl: '=',
				navStyle: '='
			},
			link: function (scope, element, attrs) {
				var el = element.parent();

				scope.ctrl.setActive(scope.menu);
				scope.navStyle['transform'] = 'translateX(-' + scope.menu[0].style.width + ')';

				scope.ctrl.onSwipe(el, 
					[
						function (start, current) {
							scope.$apply(function () {
								var width = el[0].offsetWidth;

								scope.navStyle['margin-left'] = (current.x - start.x) / width * parseInt(scope.menu[1].style.width) + 'px';
								scope.ctrl.screenStyle['margin-left'] = (current.x - start.x) + 'px';
							});
						},
						function (start, end) {
							scope.$apply(function () {
								var width = el[0].offsetWidth;

								if ( Math.abs( end.x - start.x ) * 3 > width ) {
									console.log(TweenMax)
								}
							});
						}
					]
				);
			}
		};
	});

	screen.directive('screenItem', function () {
		return {
			restrict: 'E',
			require: 'screenWrapper',
			replace: true,
			transclude: true,
			template: '<div ng-transclude></div>'
		};
	});

}) (angular.module ('snakeScreen', []));



(function (module) {

  'use scrict';

	var game = module;

	game.controller('GameScreenCtrl', ['$scope', 
		function ($scope) {

		}
	]);

	game.controller('SettingsCtrl', ['$scope', 
		function ($scope) {
			this.userSettings = {
				difficulty: 'medium',
				difficultyOptions: [
					 'hard',
					 'medium',
					 'easy'
				],
				speed: 1,
				speedOptions: [ 1, 2, 3, 4, 5 ]
			};
		}
	]);

	game.controller('GameCtrl', ['$scope', 
		function ($scope) {

		}
	]);

	game.controller('ScoreCtrl', ['$scope', 
		function ($scope) {

		}
	]);

}) (angular.module ('snakeGame', []));



(function (module) {

  'use strict';

	var login = module;

	login.controller('LoginCtrl', ['$scope', '$rootScope',
		function ($scope, $rootScope) {
			this.menu = [
				{
					name: "registration",
					url: "registration",
					style: {
						width: '219px'
					}
				},
				{
					name: "sign in",
					url: "signin",
					style: {
						width: '133px'
					}
				},
				{
					name: "registration",
					url: "registration",
					style: {
						width: '219px'
					}
				},
				{
					name: "sign in",
					url: "signin",
					style: {
						width: '133px'
					}
				}
			];

			this.navStyle = {};
		}
	]);

	login.controller('SignInCtrl', ['$scope', 
		function ($scope) {
			this.user = {
				username: '',
				password: ''
			}
		}
	]);

	login.controller('RegisterCtrl', ['$scope',
		function ($scope) {
			this.user = {
				username: '',
				password: '',
				confirmPassword: ''
			}
		}
	]);

}) (angular.module ('snakeLogin', []));



(function (module) {

  'use strict';

	var snakeApp = module;

	snakeApp.config(['$routeProvider',
		function ($routeProvider) {
			$routeProvider
				.when('/login/:menuItem', {
					templateUrl: 'views/login.html'
				})
				.when('/game/:menuItem', {
					templateUrl: 'views/screen.html'
				})
				.otherwise({
					redirectTo: function (routeParams, path, search) {
						switch( path ) {
							case '/login':
								return '/login/signin';
							case '/game':
								return '/game/settings';
							default:
								return '/game/settings';
						}
					}
				});
		}
	]);

	snakeApp.controller('AppCtrl', ['$scope', '$rootScope', '$route',
		function ($scope, $rootScope, $route) {
		}
	]);

	snakeApp.directive('ngMatch', ['$parse', function ($parse) {
 
		var directive = {
			link: link,
			restrict: 'A',
			require: '?ngModel'
		};
		return directive;
 
		function link(scope, elem, attrs, ctrl) {
			// if ngModel is not defined, we don't need to do anything
			if (!ctrl) return;
			if (!attrs['ngMatch']) return;
	 
			var firstPassword = $parse(attrs['ngMatch']);
	 
			var validator = function (value) {
				var temp = firstPassword(scope),
				v = value === temp;
				ctrl.$setValidity('match', v);
				return value;
			}
	 
			ctrl.$parsers.unshift(validator);
			ctrl.$formatters.push(validator);
			attrs.$observe('ngMatch', function () {
				validator(ctrl.$viewValue);
			});
		}
	}]);

}) (angular.module ('snakeApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'snakeScreen', 'snakeGame', 'snakeLogin']));


