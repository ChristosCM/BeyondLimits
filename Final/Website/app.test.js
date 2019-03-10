
'use strict';

const request = require('supertest');
const expect = require('expect');
const app = require('./app');

describe('test the blog service', () => {
    it('GET /blogShow succeeds', () => {
        return request(app)
	    .get('/blogShow')
	    .expect(200);
    });

    it('GET /blogShow returns JSON', () => {
        return request(app)
	    .get('/blogShow')
	    .expect('Content-type', /json/);
    });
    //Check these.
    it('POST /blogPost succeeds', () => {
        return request(app)
	    .post('/blogPost')
	    .set('title', 'Test1')
	    .set('content', 'Lorem Ipsum ...')
	    .expect(200);
    });

    it('POST /blogPost edit succeeds', () => {
        return request(app)
        .post('/blogPost/1')
        .set('title', 'Test1')
        .set('content', 'Lorem Ipsum Dolor...')
        .expect(200);
    });

    it('POST /blogDelete succeeds', () => {
        return request(app)
	    .post('/blogDelete/1')
	    .expect(200);
    });

});

describe('test the testimonials service', () => {
    it('GET /testimonialsShow succeeds', () => {
        return request(app)
        .get('/testimonialsShow')
        .expect(200);
    });

    it('GET /testimonialsShow returns JSON', () => {
        return request(app)
        .get('/testimonialsShow')
        .expect('Content-type', /json/);
    });

    it('POST /testimonialsPost succeeds', () => {
        return request(app)
        .post('/testimonialsPost')
        .set('name', 'Jake')
        .set('content', 'Lorem Ipsum ...')
        .set('pPath', '/example.png')
        .expect(200);
    });

    it('POST /testimonialsPost/:id edit succeeds', () => {
        return request(app)
        .post('/testimonialsPost/1')
        .set('name', 'Jake')
        .set('content', 'Lorem Ipsum Dolor...')
        .set('pPath', '/example.png')
        .expect(200);
    });

    it('POST /testimonialsDelete succeeds', () => {
        return request(app)
        .post('/testimonialsDelete/1')
        .expect(200);
    });
});

describe('test the events service', () => {
    it('GET /eventsAll succeeds', () => {
        return request(app)
        .get('/eventsAll')
        .expect(200);
    });

    it('GET /eventsAll/:name succeeds', () => {
        return request(app)
        .get('/eventsAll/Winter%20Ball')
        .expect(200);
    });

    it('GET /eventsAll/:name includes id1', () => {
        return request(app)
        .get('/eventsAll/Winter%20Ball')
        .expect(/1/);
    });

    it('GET /eventsAll returns JSON', () => {
        return request(app)
        .get('/eventsAll')
        .expect('Content-type', /json/);
    });

    it('POST /createEvent succeeds', () => {
        before(function(){
            request(app)
            .post('/createEvent')
            .set('name', 'Summer Formal')
            .set('attendance', 500)
            .set('vtotal', 5)
            .set('vmale', 3)
            .set('vfemale', 2)
            .expect(200);
        })
    });

    it('POST /createEvent/:id edit succeeds', () => {
        before(function(){
            request(app)
            .post('/createEvent/2')
            .set('name', 'Summer Formal')
            .set('attendance', 500)
            .set('vtotal', 6)
            .set('vmale', 3)
            .set('vfemale', 3)
            .expect(200);
        })
    });
    it('POST /deleteEvent/:id succeeds', () => {
        request(app)
        .post('/deleteEvent/2')
        .expect(200);
    });
});

describe('test the database service', () =>{
    it('GET /colSQL succeeds', () => {
        request(app)
        .get('/colSQL')
        .expect(200);
    })
    it('GET /colSQL returns correct result', () =>{
        request(app)
        .get('colSQL')
        .expect('{"events":["idEvents","eventName","attendance","volunteerTotal","volunteerMale","volunteerFemale"],"posts":["idposts","title","content","date"],"testimonials":["idtestimonials","name","content","photo"],"volunteer":["idVolunteer","First Name","Surname","Sex","Age","OriginPlace"],"volunteerevents":["idEvents","idVolunteer"]}');
    })
    it('ALL /query builds and executes SELECT query', ()=>{
        request(app)
        .get('/query')
        .set('qType', 'SELECT')
        .set('qTable', 'events')
        .set('conditions', ['idEvents=1'])
        .set('operators', [])
        .expect("Winter Ball");
    })
    it('ALL /query builds and executes INSERT query', ()=>{
        before(function(){
            request(app)
            .get('/query')
            .set('qType', 'INSERT')
            .set('qTable', 'events')
            .set('conditions', [['idEvents','eventName','attendance','volunteerTotal','volunteerMale','volunteerFemale'],[null,'Summer Formal',100,10,5,5]])
            .set('operators', [])
            .expect(200);
        });
    })
    it('ALL /query builds and executes UPDATE query', ()=>{
        before(function(){
            request(app)
            .get('/query')
            .set('qType', 'UPDATE')
            .set('qTable', 'events')
            .set('conditions', [['attendance'],[120],"eventName = 'Summer Formal'"])
            .set('operators', [])
            .expect(200);
        });
    })
    it('ALL /query builds and executes DELETE query', ()=>{
        request(app)
        .get('/query')
        .set('qType', 'DELETE')
        .set('qTable', 'events')
        .set('conditions', ['eventName = "Summer Formal"'])
        .set('operators', [])
        .expect("Winter Ball");
    })
});