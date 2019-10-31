'use strict';

import { Handler } from '../../src/og/webgl/Handler.js';
import { Renderer } from '../../src/og/renderer/Renderer.js';
import { SimpleNavigation } from '../../src/og/control/SimpleNavigation.js';
import { Axes } from '../../src/og/scene/Axes.js';
import { Vec3 } from '../../src/og/math/Vec3.js';
import { RenderNode } from '../../src/og/scene/RenderNode.js';
import { Entity } from '../../src/og/Entity/Entity.js';
import { EntityCollection } from '../../src/og/Entity/EntityCollection.js';

let handler = new Handler("frame", { 'autoActivate': true });
let renderer = new Renderer(handler, {
    'controls': [new SimpleNavigation()],
    'autoActivate': true
});

class MyScene extends RenderNode {
    constructor() {
        super("MyScene");

        this.ec = new EntityCollection({
            'entities': [
                //new Entity({
                //    'name': 'test line',
                //    'polyline': {
                //        'isClosed': false,
                //        'path3v': [[[0, 0, 0], [20, 20, 0]], [[0, 0, 0]]],
                //        'thickness': 50,
                //        'pathColors': [[[1, 1, 0], [0, 0, 0]], [[1, 0, 0]]]
                //        //'path3v': [[[0, 0, 0], [20, 20, 0], [40, 0, 20], [40, 20, 60]]],
                //        //'thickness': 10,
                //        //'pathColors': [[[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 1]]]
                //    }
                //}),
                new Entity({
                    'name': 'test line',
                    'ray': {
                        'startPosition': [0, 0, 0],
                        'endPosition': [100, 100, 100],
                        'length': 100,
                        'thickness': 15,
                        'startColor': "#ffffff",
                        'endColor': "#ff0000"
                    }
                })]
        });
    }

    init() {
        this.ec.addTo(this);
    }

    frame() {

    }
};

let myScene = new MyScene();

renderer.addNodes([new Axes(), myScene]);

window.Vec3 = Vec3;
window.renderer = renderer;

function test() {
    let p = myScene.ec._entities[0].polyline;
    p.appendPoint3v(new Vec3(60, 60, 60), [0, 1, 0]);
    p.appendPoint3v(new Vec3(0, 0, 100), [0, 0, 1]);

    p.setPointColor([1, 1, 1, 1], 0, 0);


}

//test();