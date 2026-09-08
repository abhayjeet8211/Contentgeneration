"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/me/route";
exports.ids = ["app/api/auth/me/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_abhay_Downloads_test_Contentgeneration_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/me/route.ts */ \"(rsc)/./app/api/auth/me/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/me/route\",\n        pathname: \"/api/auth/me\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/me/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\abhay\\\\Downloads\\\\test\\\\Contentgeneration\\\\app\\\\api\\\\auth\\\\me\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_abhay_Downloads_test_Contentgeneration_app_api_auth_me_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/me/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbWUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZtZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNhYmhheSU1Q0Rvd25sb2FkcyU1Q3Rlc3QlNUNDb250ZW50Z2VuZXJhdGlvbiU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDYWJoYXklNUNEb3dubG9hZHMlNUN0ZXN0JTVDQ29udGVudGdlbmVyYXRpb24maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ2tDO0FBQy9HO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29udGVudC1pbnRlbGxpZ2VuY2UtcGxhdGZvcm0vP2ZjMmEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcYWJoYXlcXFxcRG93bmxvYWRzXFxcXHRlc3RcXFxcQ29udGVudGdlbmVyYXRpb25cXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXG1lXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL21lL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9tZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9tZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGFiaGF5XFxcXERvd25sb2Fkc1xcXFx0ZXN0XFxcXENvbnRlbnRnZW5lcmF0aW9uXFxcXGFwcFxcXFxhcGlcXFxcYXV0aFxcXFxtZVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9tZS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/me/route.ts":
/*!**********************************!*\
  !*** ./app/api/auth/me/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth_session__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth/session */ \"(rsc)/./lib/auth/session.ts\");\n\n\nasync function GET() {\n    const user = await (0,_lib_auth_session__WEBPACK_IMPORTED_MODULE_1__.getCurrentUser)();\n    if (!user) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            user: null\n        }, {\n            status: 401\n        });\n    }\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        user\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbWUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJDO0FBQ1M7QUFFN0MsZUFBZUU7SUFDcEIsTUFBTUMsT0FBTyxNQUFNRixpRUFBY0E7SUFDakMsSUFBSSxDQUFDRSxNQUFNO1FBQ1QsT0FBT0gscURBQVlBLENBQUNJLElBQUksQ0FBQztZQUFFRCxNQUFNO1FBQUssR0FBRztZQUFFRSxRQUFRO1FBQUk7SUFDekQ7SUFDQSxPQUFPTCxxREFBWUEsQ0FBQ0ksSUFBSSxDQUFDO1FBQUVEO0lBQUs7QUFDbEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb250ZW50LWludGVsbGlnZW5jZS1wbGF0Zm9ybS8uL2FwcC9hcGkvYXV0aC9tZS9yb3V0ZS50cz9jNzIzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcclxuaW1wb3J0IHsgZ2V0Q3VycmVudFVzZXIgfSBmcm9tICdAL2xpYi9hdXRoL3Nlc3Npb24nO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVCgpIHtcclxuICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0Q3VycmVudFVzZXIoKTtcclxuICBpZiAoIXVzZXIpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHVzZXI6IG51bGwgfSwgeyBzdGF0dXM6IDQwMSB9KTtcclxuICB9XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgdXNlciB9KTtcclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0Q3VycmVudFVzZXIiLCJHRVQiLCJ1c2VyIiwianNvbiIsInN0YXR1cyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/me/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth/session.ts":
/*!*****************************!*\
  !*** ./lib/auth/session.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createSession: () => (/* binding */ createSession),\n/* harmony export */   destroySession: () => (/* binding */ destroySession),\n/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/sign.js\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/verify.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_db_prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db/prisma */ \"(rsc)/./lib/db/prisma.ts\");\n\n\n\n\nconst JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || \"content-intelligence-platform-jwt-secret-key-2026\");\nconst COOKIE_NAME = \"app_session\";\nconst SESSION_EXPIRATION_DAYS = 7;\nasync function hashPassword(password) {\n    const salt = await bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().genSalt(10);\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(password, salt);\n}\nasync function verifyPassword(password, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(password, hash);\n}\nasync function createSession(userId) {\n    const expiresAt = new Date();\n    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRATION_DAYS);\n    const token = await new jose__WEBPACK_IMPORTED_MODULE_3__.SignJWT({\n        userId\n    }).setProtectedHeader({\n        alg: \"HS256\"\n    }).setIssuedAt().setExpirationTime(`${SESSION_EXPIRATION_DAYS}d`).sign(JWT_SECRET);\n    // Store in database\n    await _lib_db_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.session.create({\n        data: {\n            token,\n            userId,\n            expiresAt\n        }\n    });\n    // Set HTTP-only cookie\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    cookieStore.set(COOKIE_NAME, token, {\n        httpOnly: true,\n        secure: \"development\" === \"production\",\n        sameSite: \"lax\",\n        expires: expiresAt,\n        path: \"/\"\n    });\n    return token;\n}\nasync function destroySession() {\n    const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n    const token = cookieStore.get(COOKIE_NAME)?.value;\n    if (token) {\n        try {\n            await _lib_db_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.session.deleteMany({\n                where: {\n                    token\n                }\n            });\n        } catch  {\n        // Ignore if session already deleted\n        }\n    }\n    cookieStore.set(COOKIE_NAME, \"\", {\n        httpOnly: true,\n        expires: new Date(0),\n        path: \"/\"\n    });\n}\nasync function getCurrentUser() {\n    try {\n        const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)();\n        const token = cookieStore.get(COOKIE_NAME)?.value;\n        if (!token) return null;\n        const { payload } = await (0,jose__WEBPACK_IMPORTED_MODULE_4__.jwtVerify)(token, JWT_SECRET);\n        const userId = payload.userId;\n        if (!userId) return null;\n        const user = await _lib_db_prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n            where: {\n                id: userId\n            },\n            select: {\n                id: true,\n                email: true,\n                name: true,\n                avatarUrl: true,\n                createdAt: true\n            }\n        });\n        return user;\n    } catch  {\n        return null;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC9zZXNzaW9uLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQTBDO0FBQ1o7QUFDUztBQUNFO0FBRXpDLE1BQU1LLGFBQWEsSUFBSUMsY0FBY0MsTUFBTSxDQUN6Q0MsUUFBUUMsR0FBRyxDQUFDSixVQUFVLElBQUk7QUFHNUIsTUFBTUssY0FBYztBQUNwQixNQUFNQywwQkFBMEI7QUFFekIsZUFBZUMsYUFBYUMsUUFBZ0I7SUFDakQsTUFBTUMsT0FBTyxNQUFNWix1REFBYyxDQUFDO0lBQ2xDLE9BQU9BLG9EQUFXLENBQUNXLFVBQVVDO0FBQy9CO0FBRU8sZUFBZUcsZUFBZUosUUFBZ0IsRUFBRUcsSUFBWTtJQUNqRSxPQUFPZCx1REFBYyxDQUFDVyxVQUFVRztBQUNsQztBQUVPLGVBQWVHLGNBQWNDLE1BQWM7SUFDaEQsTUFBTUMsWUFBWSxJQUFJQztJQUN0QkQsVUFBVUUsT0FBTyxDQUFDRixVQUFVRyxPQUFPLEtBQUtiO0lBRXhDLE1BQU1jLFFBQVEsTUFBTSxJQUFJekIseUNBQU9BLENBQUM7UUFBRW9CO0lBQU8sR0FDdENNLGtCQUFrQixDQUFDO1FBQUVDLEtBQUs7SUFBUSxHQUNsQ0MsV0FBVyxHQUNYQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUVsQix3QkFBd0IsQ0FBQyxDQUFDLEVBQy9DbUIsSUFBSSxDQUFDekI7SUFFUixvQkFBb0I7SUFDcEIsTUFBTUQsa0RBQU1BLENBQUMyQixPQUFPLENBQUNDLE1BQU0sQ0FBQztRQUMxQkMsTUFBTTtZQUNKUjtZQUNBTDtZQUNBQztRQUNGO0lBQ0Y7SUFFQSx1QkFBdUI7SUFDdkIsTUFBTWEsY0FBYy9CLHFEQUFPQTtJQUMzQitCLFlBQVlDLEdBQUcsQ0FBQ3pCLGFBQWFlLE9BQU87UUFDbENXLFVBQVU7UUFDVkMsUUFBUTdCLGtCQUF5QjtRQUNqQzhCLFVBQVU7UUFDVkMsU0FBU2xCO1FBQ1RtQixNQUFNO0lBQ1I7SUFFQSxPQUFPZjtBQUNUO0FBRU8sZUFBZWdCO0lBQ3BCLE1BQU1QLGNBQWMvQixxREFBT0E7SUFDM0IsTUFBTXNCLFFBQVFTLFlBQVlRLEdBQUcsQ0FBQ2hDLGNBQWNpQztJQUU1QyxJQUFJbEIsT0FBTztRQUNULElBQUk7WUFDRixNQUFNckIsa0RBQU1BLENBQUMyQixPQUFPLENBQUNhLFVBQVUsQ0FBQztnQkFDOUJDLE9BQU87b0JBQUVwQjtnQkFBTTtZQUNqQjtRQUNGLEVBQUUsT0FBTTtRQUNOLG9DQUFvQztRQUN0QztJQUNGO0lBRUFTLFlBQVlDLEdBQUcsQ0FBQ3pCLGFBQWEsSUFBSTtRQUMvQjBCLFVBQVU7UUFDVkcsU0FBUyxJQUFJakIsS0FBSztRQUNsQmtCLE1BQU07SUFDUjtBQUNGO0FBRU8sZUFBZU07SUFDcEIsSUFBSTtRQUNGLE1BQU1aLGNBQWMvQixxREFBT0E7UUFDM0IsTUFBTXNCLFFBQVFTLFlBQVlRLEdBQUcsQ0FBQ2hDLGNBQWNpQztRQUU1QyxJQUFJLENBQUNsQixPQUFPLE9BQU87UUFFbkIsTUFBTSxFQUFFc0IsT0FBTyxFQUFFLEdBQUcsTUFBTTlDLCtDQUFTQSxDQUFDd0IsT0FBT3BCO1FBQzNDLE1BQU1lLFNBQVMyQixRQUFRM0IsTUFBTTtRQUU3QixJQUFJLENBQUNBLFFBQVEsT0FBTztRQUVwQixNQUFNNEIsT0FBTyxNQUFNNUMsa0RBQU1BLENBQUM0QyxJQUFJLENBQUNDLFVBQVUsQ0FBQztZQUN4Q0osT0FBTztnQkFBRUssSUFBSTlCO1lBQU87WUFDcEIrQixRQUFRO2dCQUNORCxJQUFJO2dCQUNKRSxPQUFPO2dCQUNQQyxNQUFNO2dCQUNOQyxXQUFXO2dCQUNYQyxXQUFXO1lBQ2I7UUFDRjtRQUVBLE9BQU9QO0lBQ1QsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb250ZW50LWludGVsbGlnZW5jZS1wbGF0Zm9ybS8uL2xpYi9hdXRoL3Nlc3Npb24udHM/ZjY1OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTaWduSldULCBqd3RWZXJpZnkgfSBmcm9tICdqb3NlJztcclxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XHJcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9kYi9wcmlzbWEnO1xyXG5cclxuY29uc3QgSldUX1NFQ1JFVCA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShcclxuICBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8ICdjb250ZW50LWludGVsbGlnZW5jZS1wbGF0Zm9ybS1qd3Qtc2VjcmV0LWtleS0yMDI2J1xyXG4pO1xyXG5cclxuY29uc3QgQ09PS0lFX05BTUUgPSAnYXBwX3Nlc3Npb24nO1xyXG5jb25zdCBTRVNTSU9OX0VYUElSQVRJT05fREFZUyA9IDc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gIGNvbnN0IHNhbHQgPSBhd2FpdCBiY3J5cHQuZ2VuU2FsdCgxMCk7XHJcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCBzYWx0KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcsIGhhc2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gIHJldHVybiBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgaGFzaCk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTZXNzaW9uKHVzZXJJZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICBjb25zdCBleHBpcmVzQXQgPSBuZXcgRGF0ZSgpO1xyXG4gIGV4cGlyZXNBdC5zZXREYXRlKGV4cGlyZXNBdC5nZXREYXRlKCkgKyBTRVNTSU9OX0VYUElSQVRJT05fREFZUyk7XHJcblxyXG4gIGNvbnN0IHRva2VuID0gYXdhaXQgbmV3IFNpZ25KV1QoeyB1c2VySWQgfSlcclxuICAgIC5zZXRQcm90ZWN0ZWRIZWFkZXIoeyBhbGc6ICdIUzI1NicgfSlcclxuICAgIC5zZXRJc3N1ZWRBdCgpXHJcbiAgICAuc2V0RXhwaXJhdGlvblRpbWUoYCR7U0VTU0lPTl9FWFBJUkFUSU9OX0RBWVN9ZGApXHJcbiAgICAuc2lnbihKV1RfU0VDUkVUKTtcclxuXHJcbiAgLy8gU3RvcmUgaW4gZGF0YWJhc2VcclxuICBhd2FpdCBwcmlzbWEuc2Vzc2lvbi5jcmVhdGUoe1xyXG4gICAgZGF0YToge1xyXG4gICAgICB0b2tlbixcclxuICAgICAgdXNlcklkLFxyXG4gICAgICBleHBpcmVzQXQsXHJcbiAgICB9LFxyXG4gIH0pO1xyXG5cclxuICAvLyBTZXQgSFRUUC1vbmx5IGNvb2tpZVxyXG4gIGNvbnN0IGNvb2tpZVN0b3JlID0gY29va2llcygpO1xyXG4gIGNvb2tpZVN0b3JlLnNldChDT09LSUVfTkFNRSwgdG9rZW4sIHtcclxuICAgIGh0dHBPbmx5OiB0cnVlLFxyXG4gICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxyXG4gICAgc2FtZVNpdGU6ICdsYXgnLFxyXG4gICAgZXhwaXJlczogZXhwaXJlc0F0LFxyXG4gICAgcGF0aDogJy8nLFxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gdG9rZW47XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZXN0cm95U2Vzc2lvbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcclxuICBjb25zdCB0b2tlbiA9IGNvb2tpZVN0b3JlLmdldChDT09LSUVfTkFNRSk/LnZhbHVlO1xyXG5cclxuICBpZiAodG9rZW4pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHByaXNtYS5zZXNzaW9uLmRlbGV0ZU1hbnkoe1xyXG4gICAgICAgIHdoZXJlOiB7IHRva2VuIH0sXHJcbiAgICAgIH0pO1xyXG4gICAgfSBjYXRjaCB7XHJcbiAgICAgIC8vIElnbm9yZSBpZiBzZXNzaW9uIGFscmVhZHkgZGVsZXRlZFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29va2llU3RvcmUuc2V0KENPT0tJRV9OQU1FLCAnJywge1xyXG4gICAgaHR0cE9ubHk6IHRydWUsXHJcbiAgICBleHBpcmVzOiBuZXcgRGF0ZSgwKSxcclxuICAgIHBhdGg6ICcvJyxcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcclxuICAgIGNvbnN0IHRva2VuID0gY29va2llU3RvcmUuZ2V0KENPT0tJRV9OQU1FKT8udmFsdWU7XHJcblxyXG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhd2FpdCBqd3RWZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpO1xyXG4gICAgY29uc3QgdXNlcklkID0gcGF5bG9hZC51c2VySWQgYXMgc3RyaW5nO1xyXG5cclxuICAgIGlmICghdXNlcklkKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgIHdoZXJlOiB7IGlkOiB1c2VySWQgfSxcclxuICAgICAgc2VsZWN0OiB7XHJcbiAgICAgICAgaWQ6IHRydWUsXHJcbiAgICAgICAgZW1haWw6IHRydWUsXHJcbiAgICAgICAgbmFtZTogdHJ1ZSxcclxuICAgICAgICBhdmF0YXJVcmw6IHRydWUsXHJcbiAgICAgICAgY3JlYXRlZEF0OiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHVzZXI7XHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIlNpZ25KV1QiLCJqd3RWZXJpZnkiLCJiY3J5cHQiLCJjb29raWVzIiwicHJpc21hIiwiSldUX1NFQ1JFVCIsIlRleHRFbmNvZGVyIiwiZW5jb2RlIiwicHJvY2VzcyIsImVudiIsIkNPT0tJRV9OQU1FIiwiU0VTU0lPTl9FWFBJUkFUSU9OX0RBWVMiLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsInNhbHQiLCJnZW5TYWx0IiwiaGFzaCIsInZlcmlmeVBhc3N3b3JkIiwiY29tcGFyZSIsImNyZWF0ZVNlc3Npb24iLCJ1c2VySWQiLCJleHBpcmVzQXQiLCJEYXRlIiwic2V0RGF0ZSIsImdldERhdGUiLCJ0b2tlbiIsInNldFByb3RlY3RlZEhlYWRlciIsImFsZyIsInNldElzc3VlZEF0Iiwic2V0RXhwaXJhdGlvblRpbWUiLCJzaWduIiwic2Vzc2lvbiIsImNyZWF0ZSIsImRhdGEiLCJjb29raWVTdG9yZSIsInNldCIsImh0dHBPbmx5Iiwic2VjdXJlIiwic2FtZVNpdGUiLCJleHBpcmVzIiwicGF0aCIsImRlc3Ryb3lTZXNzaW9uIiwiZ2V0IiwidmFsdWUiLCJkZWxldGVNYW55Iiwid2hlcmUiLCJnZXRDdXJyZW50VXNlciIsInBheWxvYWQiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsImlkIiwic2VsZWN0IiwiZW1haWwiLCJuYW1lIiwiYXZhdGFyVXJsIiwiY3JlYXRlZEF0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth/session.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db/prisma.ts":
/*!**************************!*\
  !*** ./lib/db/prisma.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLQyxLQUF5QixHQUFnQjtRQUFDO1FBQVM7UUFBUztLQUFPLEdBQUcsQ0FBUztBQUN0RixHQUFHO0FBRUwsSUFBSUEsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29udGVudC1pbnRlbGxpZ2VuY2UtcGxhdGZvcm0vLi9saWIvZGIvcHJpc21hLnRzPzA5NjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnO1xyXG5cclxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcclxuICBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBwcmlzbWEgPVxyXG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz9cclxuICBuZXcgUHJpc21hQ2xpZW50KHtcclxuICAgIGxvZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyBbJ3F1ZXJ5JywgJ2Vycm9yJywgJ3dhcm4nXSA6IFsnZXJyb3InXSxcclxuICB9KTtcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xyXG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSIsImxvZyIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fme%2Froute&page=%2Fapi%2Fauth%2Fme%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fme%2Froute.ts&appDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cabhay%5CDownloads%5Ctest%5CContentgeneration&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();