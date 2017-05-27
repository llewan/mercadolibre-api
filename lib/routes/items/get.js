import requestify from 'requestify';
import itemFromApiToUI from '../../mapper';
import status from 'statuses';
import Constants from '../../constants';

/* eslint-disable no-unused-vars */
const getItem = (input) => {
	const param = input.params.id;

	const itemReq = requestify.get(`${Constants.API_ML_GET_ITEM}/${param}`);
	const descReq = requestify.get(`${Constants.API_ML_GET_ITEM}/${param}/description`);
	
	return Promise.all([itemReq, descReq]).then(results => {
		const body = results.map(result => result.getBody());
		const baseItem = ([item, _]) => itemFromApiToUI(item);
		const description = ([_, {plain_text}]) => ({ description: plain_text });
		const picture = ([item, _]) => ({ picture: item.pictures[0].url });
		const sold_quantity = ([{sold_quantity}, _]) => ({ sold_quantity });

		const toItemObj = (accum, fn) => Object.assign(accum, fn(body));
		const item = [baseItem, description, picture, sold_quantity].reduce(toItemObj, {});

		return Promise.resolve({
			status: status('ok'),
			body: { item }
		});
	})
		.catch(e => Promise.reject({
			status: e.getCode(),
			body: e.getBody()
		}));
};

export default getItem;