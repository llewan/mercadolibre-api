import expect from 'expect';
import requestify from 'requestify';
import {describe, it, afterEach, beforeEach} from 'mocha';
import status from 'statuses';
import getItem from './get';

describe('#getItem', function () {
  afterEach(function () {
    expect.restoreSpies();
  });
  describe('(when everything is OK)', function () {
    beforeEach(function () {
      let i = 0;
      this.mockDescription = {
        plain_text: 'hi'
      };
      this.mockItem = {
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
      };
      this.mockData = [this.mockItem, this.mockDescription];
      const reqMock = Promise.resolve({ getBody: () => this.mockData[i++] });
      this.reqSpy = expect.spyOn(requestify, 'get').andReturn(reqMock);
      this.input = { params: { id: 1 } };
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

    it('should return a body with the item object', function () {
      return getItem(this.input).then(res => {
        expect(res.body.item.id).toBe(this.mockItem.id);
      });
    });
  });

  describe('(when everything is not OK)', function () {
    beforeEach(function () {
      this.statusCode = 500;
      this.message = 'internal error';
      this.mockData = [{ message: this.message }, {}];
      const reqMock = Promise.reject({ getCode: () => this.statusCode, getBody: () => this.mockData[0] });
      this.reqSpy = expect.spyOn(requestify, 'get').andReturn(reqMock);
      this.input = { params: { id: 1 } };
    });

    it('should return a Promise', function () {
      const actual = getItem(this.input);
      expect(actual).toBeA(Promise);
    });

    it('should call requestify', function () {
      getItem(this.input);
      expect(this.reqSpy).toHaveBeenCalled();
    });

    it('should return status 500', function () {
      return getItem(this.input).then()
        .catch(err => expect(err.status).toEqual(this.statusCode));
    });

    it('should return an error message', function () {
      return getItem(this.input).then()
        .catch(err => expect(err.body.message).toEqual(this.message));
    });
  });
});
