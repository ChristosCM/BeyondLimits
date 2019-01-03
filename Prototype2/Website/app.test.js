
'use strict';

const request = require('supertest');
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
        return request(app)
        .post('/createEvent')
        .set('eventName', 'Summer Formal')
        .set('attendance', 500)
        .set('volunteerTotal', 5)
        .set('volunteerMale', 3)
        .set('volunteerFemale', 2)
        .expect(200);
    });

    it('POST /createEvent/:id edit succeeds', () => {
        return request(app)
        .post('/createEvent/')
        .set('eventName', 'Summer Formal')
        .set('attendance', 500)
        .set('volunteerTotal', 6)
        .set('volunteerMale', 3)
        .set('volunteerFemale', 3)
        .expect(200);
    });

    it('POST /deleteEvent/:id succeeds', () => {
        return request(app)
        .post('/deleteEvents/8')
        .expect(200);
    });

});