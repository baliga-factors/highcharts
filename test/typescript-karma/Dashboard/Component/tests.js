//@ts-check
import ChartComponent from '/base/js/Dashboard/Component/ChartComponent.js';
import HTMLComponent from '/base/js/Dashboard/Component/HTMLComponent.js';
import Component from '/base/js/Dashboard/Component/Component.js';
import CSVStore from '/base/js/Data/Stores/CSVStore.js';

import Highcharts from '/base/js/masters/highcharts.src.js';
import Stock from '/base/js/masters/highstock.src.js';
import Gantt from '/base/js/masters/highcharts-gantt.src.js';
import Maps from '/base/js/masters/highmaps.src.js';

const { test, only } = QUnit;

/** @type {Component.Event['type'][]} */
const eventTypes = [
    'load',
    'afterLoad',
    'render',
    'afterRender',
    'redraw',
    'afterRedraw',
    'tableChanged',
    'storeAttached',
    'update',
    'afterUpdate',
    'message'
];

/** @type {Component.Event['type'][]} */
const registeredEvents = [];

/** @param {Component.Event} e */
function registerEvent(e) {
    registeredEvents.push(e.type);
}
/**
 * @param {any[]} [array]
 */
function emptyArray(array) {
    while (array.length) {
        array.pop();
    }
}
/** @param {ChartComponent | HTMLComponent} component */
function registerEvents(component) {
    eventTypes.forEach(eventType => component.on(eventType, registerEvent))
}

test('ChartComponent events', function (assert) {
    const parentElement = document.createElement('div');
    const store = new CSVStore(undefined, {
        csv: '1,2,3',
        firstRowAsNames: false
    });

    store.load();

    const component = new ChartComponent({
        parentElement
    });


    registerEvents(component);

    component.render();
    const expectedEvents = ['load', 'afterLoad', 'render', 'afterRender']
    assert.deepEqual(registeredEvents, expectedEvents);

    component.setStore(store)
    expectedEvents.push('storeAttached');
    assert.deepEqual(
        registeredEvents,
        expectedEvents,
        'Attaching a store should fire an evnet'
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // With a store set in constructor
    const componentWithStore = new ChartComponent({
        parentElement,
        store
    });
    registerEvents(componentWithStore);

    componentWithStore.render();

    expectedEvents.push('load', 'storeAttached', 'afterLoad', 'render', 'afterRender');
    assert.deepEqual(
        registeredEvents,
        expectedEvents,
        'If store is given in options, it will be attached during load'
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // Table updates
    // This test doesn't work as there's a timeout going on

    // store.table.getRow(0).insertCell('test', 0);
    // store.table.insertRow(store.table.getRow(0))
    // expectedEvents.push('tableChanged', 'xxx');
    //
    // assert.deepEqual(
    //     registeredEvents,
    //     expectedEvents
    // );


    // emptyArray(registeredEvents);
    // emptyArray(expectedEvents);

    // Redraws -> should also fire render
    component.redraw();
    expectedEvents.push('redraw', 'render', 'afterRender');


    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // Update
    component.update({
        dimensions: {
            width: 150,
            height: 200
        }
    });

    expectedEvents.push('update', 'afterUpdate');
    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // Message
    expectedEvents.push('message');

    // This should fire a 'message' event to all the other components
    // We should expect N - 1 'message' events (in this case 1)

    component.postMessage('hello');

    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    // This should bounce a message back and forth
    component.postMessage({
        callback: function () {
            this.postMessage('hello');
        }
    });

    expectedEvents.push('message', 'message');

    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    Component.removeInstance(component);
    Component.removeInstance(componentWithStore);

});


test('HTMLComponent events', function (assert) {
    const parentElement = document.createElement('div');
    const store = new CSVStore(undefined, {
        csv: '1,2,3',
        firstRowAsNames: false
    });

    store.load();

    const component = new HTMLComponent({
        parentElement
    });


    registerEvents(component);

    component.render();
    const expectedEvents = ['load', 'afterLoad', 'render', 'afterRender']
    assert.deepEqual(registeredEvents, expectedEvents);

    component.setStore(store);
    expectedEvents.push('storeAttached');
    assert.deepEqual(
        registeredEvents,
        expectedEvents,
        'Attaching a store should fire an event'
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // With a store set in constructor
    const componentWithStore = new HTMLComponent({
        parentElement,
        store
    });
    registerEvents(componentWithStore);

    componentWithStore.render();

    expectedEvents.push('load', 'storeAttached', 'afterLoad', 'render', 'afterRender');
    assert.deepEqual(
        registeredEvents,
        expectedEvents,
        'If store is given in options, it will be attached during load'
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // Table updates
    // This test doesn't work as there's a timeout going on

    // store.table.getRow(0).insertCell('test', 0);
    // store.table.insertRow(store.table.getRow(0))
    // expectedEvents.push('tableChanged', 'xxx');
    //
    // assert.deepEqual(
    //     registeredEvents,
    //     expectedEvents
    // );


    // emptyArray(registeredEvents);
    // emptyArray(expectedEvents);

    // Redraws -> should also fire render
    component.redraw();
    expectedEvents.push('redraw', 'render', 'afterRender', 'afterRedraw');


    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // Update
    component.update({
        dimensions: {
            width: 150,
            height: 200
        }
    });

    expectedEvents.push('update', 'afterUpdate');
    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    // Message
    expectedEvents.push('message');

    // This should fire a 'message' event to all the other components
    // We should expect N - 1 'message' events (in this case 1)

    component.postMessage('hello');

    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    // This should bounce a message back and forth
    component.postMessage({
        callback: function () {
            this.postMessage('hello');
        }
    });

    expectedEvents.push('message', 'message');
    assert.deepEqual(
        registeredEvents,
        expectedEvents
    );

    emptyArray(registeredEvents);
    emptyArray(expectedEvents);

    Component.removeInstance(component);
    Component.removeInstance(componentWithStore);
});

test('ChartComponent constructors', function (assert) {
    const constructorMap = {
        '': Highcharts,
        'stock': Stock,
        'maps': Maps,
        'gantt': Gantt
    }

    Object.keys(constructorMap).forEach(HCType =>{
        const component = new ChartComponent({
            Highcharts: constructorMap[HCType],
            chartConstructor: HCType,
            chartOptions: {}
        }).load();
        // Test that the constructor creates a chart
        assert.ok(component.chart, `Able to create a ${HCType} chart`);

    })
});