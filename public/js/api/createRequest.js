/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  let formData;
  const url = new URL(options.url, "http://localhost:8000");
  if (options.method === "GET") {
    if (options.data) {
      for (const [paramName, paramValue] of Object.entries(options.data)) {
        url.searchParams.append(paramName, paramValue);
      }
    }
  } else {
    formData = new FormData();
    for (const [paramName, paramValue] of Object.entries(options.data)) {
      formData.append(paramName, paramValue);
    }
  }
  try {
    xhr.open(options.method, url);
    xhr.send(formData);
  } catch (err) {
    options.callback(err, null);
  }
  xhr.onload = () => {
    if (xhr.status === 200) {
      options.callback(null, xhr.response);
    } else {
      options.callback(xhr.statusText, null);
    }
  };
};
