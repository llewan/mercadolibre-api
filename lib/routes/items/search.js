import requestify from 'requestify';
import itemFromApiToUI from '../../mapper';
import status from 'statuses';
import compose from 'lodash.compose';
import Constants from '../../constants';

/* eslint-disable no-unused-vars */
const searchItems = (input) => {
	const search = input.query.search;
	const path = `${Constants.API_ML_SEARCH_ITEMS}/search?q=${search}`;

	if (search && search != 'undefined') {
		return requestify.get(path)
			.then(response => {
				const { results, available_filters } = response.getBody();
				const desc = (x, y) => x.results - y.results;
				const filterCategory = filter => filter.id === 'category';
				const getCategoryName = categories => categories.map(aCategory => aCategory.name);
				const getBestOnes = categories => categories.sort(desc).slice(-4);
				const getFilterCategories = filters => filters.find(filterCategory) ? filters.find(filterCategory).values : [];

				const categories = compose(getCategoryName, getBestOnes, getFilterCategories)(available_filters);
				const items = results.slice(0, 4).map(itemFromApiToUI);

				return Promise.resolve({
					status: status('ok'),
					body: { items, categories }
				});
			})
			.catch(e => Promise.reject({
				status: e.code,
				body: e.body
			}));
	}

	return Promise.reject({
		status: status('bad request'),
		body: { message: 'bad request' }
	});
};

export default searchItems;