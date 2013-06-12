/*global chrome*/

(function(management, omnibox) {
    'use strict';

    /** Get installed user's extensions */
    management.getAll(function( /*array of ExtensionInfo result*/ extensions) {
        omnibox.onInputChanged.addListener(function( /*string*/ text, /*function*/ suggest) {
            var suggestRegExp = new RegExp(text.replace('+', '\\+'), 'i');

            suggest(
                /** filter extensions by name */
                extensions.filter(function(extension) {
                    return suggestRegExp.test(extension.name);
                }).map(function(extension) {
                    /** return collection matched extensions to suggest */
                    return {
                        content: extension.name,
                        description: extension.name
                    };
                })
            );
        });

        omnibox.onInputEntered.addListener(function( /*string*/ text) {
            extensions.filter(function(extension) {
                return extension.name === text;
            }).forEach(function(extension) {
                management.launchApp(extension.id);
            });
        });
    });

}(chrome.management, chrome.omnibox));
