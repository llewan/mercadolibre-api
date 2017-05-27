import {describe, it, afterEach, beforeEach} from 'mocha';
import expect from 'expect';
import requestify from 'requestify';
import status from 'statuses';
import getItem from './search';

describe('#search', function () {
  afterEach(function () {
    expect.restoreSpies();
  });

  describe('(when everything is OK)', function () {
    beforeEach(function () {
      const getMockItem = props => Object.assign({}, {
        id: 2,
        title: 'this is the title',
        sold_quantity: 23,
        pictures: [{ url: 'http://' }],
        condition: 'new',
        shipping: { free_shipping: true },
        price: 999,
        currency_id: 'ARS',
        thumbnail: 'http://',
        seller_address: { state: { name: 'bsas' } }
      }, props);

      this.mockResponse = {
        results: [
          getMockItem({ id: 1 }),
          getMockItem({ id: 2 }),
          getMockItem({ id: 3 }),
          getMockItem({ id: 4 }),
          getMockItem({ id: 5 })],
        available_filters: [{
          id: 'category', values: [
            { results: 10, name: 'cat1' },
            { results: 2, name: 'cat2' },
            { results: 100, name: 'cat3' },
            { results: 50, name: 'cat4' },
            { results: 5, name: 'cat5' }
          ]
        }]
      };

      const reqMock = Promise.resolve({ getBody: () => this.mockResponse });
      this.reqSpy = expect.spyOn(requestify, 'get').andReturn(reqMock);
      this.input = { query: { search: 'ipad' } };
    });

    it('should return a promise', function () {
      const actual = getItem(this.input);
      expect(actual).toBeA(Promise);
    });

    it('should call requestify', function () {
      getItem(this.input);
      expect(this.reqSpy).toHaveBeenCalled();
    });

    it('should return status 200', function () {
      return getItem(this.input).then(res => {
        expect(res.status).toEqual(status('ok'));
      });
    });

    it('should return a body with items and categories', function () {
      return getItem(this.input).then(res => {
        expect(res.body).toIncludeKeys(['items', 'categories']);
      });
    });

    it('should return best filterCategories', function () {
      return getItem(this.input).then(res => {
        expect(res.body.categories[3]).toBe('cat3');
      });
    });

    it('should return 4 filterCategories', function () {
      return getItem(this.input).then(res => {
        expect(res.body.categories.length).toEqual(4);
      });
    });

    it('should return 4 items', function () {
      return getItem(this.input).then(res => {
        expect(res.body.items.length).toEqual(4);
      });
    });
  });

  describe('(when everything is not OK)', function () {
    beforeEach(function () {
      this.mockResponse = {};
      const reqMock = Promise.resolve({ getBody: () => this.mockResponse });
      this.reqSpy = expect.spyOn(requestify, 'get').andReturn(reqMock);
      this.input = { query: { q: 'asd' } };
    });

    it('should return a promise', function () {
      const actual = getItem(this.input);
      expect(actual).toBeA(Promise);
    });

    it('should return bad request code', function () {
      return getItem(this.input).then()
        .catch(err => expect(err.status).toEqual(status('bad request')));
    });

    it('should return a body error', function () {
      return getItem(this.input).then()
        .catch(err => expect(err.body.message).toEqual('bad request'));
    });

  });
});
