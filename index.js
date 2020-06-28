'use strict'

var rule = require('unified-lint-rule');
var generated = require('unist-util-generated');
var visit = require('unist-util-visit');

var uriRegex = /https?:\/\/(?:osu|new)\.ppy\.sh\/([^\/]+)/;
var uriWarnings = {
    b: 'Beatmap URLs should use the /beatmapsets/{beatmapset-id}#{mode}/{beatmap-id} format',
    beatmaps: 'Beatmap URLs should use the /beatmapsets/{beatmapset-id}#{mode}/{beatmap-id} format',
    mp: 'Multiplayer match URLs should use the /community/matches/{match-id} format',
    s: 'Beatmapset URLs should use the /beatmapsets/{beatmapset-id} format',
    u: 'User URLs should use the /users/{user-id} format',
};

function osuLinks(tree, file) {
    visit(tree, 'link', visitor);

    function visitor(node) {
        if (generated(node))
            return;

        var uriMatch = node.url.match(uriRegex);

        if (uriMatch !== null) {
            var warning = uriWarnings[uriMatch[1]];

            if (warning !== undefined)
                file.message(warning, node);
        }
    }
}

module.exports = rule('remark-lint-osu:links', osuLinks);
