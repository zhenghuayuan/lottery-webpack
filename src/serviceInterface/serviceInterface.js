/**
 * Created by John on 2017-02-14 .
 */

let service = {
	url: 'https://api.s9k.com/index.php?service='
};

service.getRequest = (vueObj, url, options, callback) => {
	const data = {
		url: url,
		options: options,
		type: 'GET'
	};
	service.ajaxRequest(vueObj, data, callback);
};

service.ajaxRequest = (vueObj, data, callback) => {
	if (data.type == 'GET') {
		vueObj.$http.get(data.url, { params: data.options }).then((res) => {
			requestSuccessed(res.data, callback);
		});
	}
};

const requestSuccessed = (res, callback) => {
	callback(res);
};

service.getOpencodeByType = (vueObj, options, callback) => {
	service.getRequest(vueObj, service.url + 'Lottery.GetOpencodeByType', options, callback);
};

service.getOpencodeByCode = (vueObj, options, callback) => {
	service.getRequest(vueObj, service.url + 'Lottery.GetOpencodeByCode', options, callback);
};

service.getNewestOpencode = (vueObj, options, callback) => {
	service.getRequest(vueObj, service.url + 'Lottery.GetNewestOpencode', options, callback);
};

export default service;
