const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

// ServerSideRender
export const getDataSSR = async (url, header) => {
  const res = await fetch(`${baseUrl}/api${url}`, {
    method: 'GET',
    headers: header
  });
  const data = await res.json();
  return data;
};

export const getData = async (url) => {
  const res = await fetch(`${baseUrl}/api${url}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    // credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // Authorization: header
    }
  });
  const data = await res.json();
  return data;
};

export const postData = async (url, postData) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'POST',
    mode: 'cors',
    // cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  const data = await res.json();
  return data;
};

// for fetchAPI to process images, do not include content-type in the headers and data should be handled by new FormData()
export const postFileData = async (url, postData) => {
  const res = await fetch(`${baseUrl}/api${url}`, {
    method: 'POST',
    // mode: 'cors',
    // cache: 'no-cache',
    credentials: 'include',
    // credentials: 'same-origin',
    body: postData
  });
  const data = await res.json();
  return data;
};

export const putData = async (url, putData) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PUT',
    // mode: 'cors',
    // cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(putData)
  });
  const data = await res.json();
  return data;
};

export const patchData = async (url, patchData) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patchData)
  });
  const data = await res.json();
  return data;
};
export const deleteData = async (url) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'DELETE',
    mode: 'cors',
    // cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // Authorization: token,
    },
    // body: JSON.stringify(deleteData)
  });
  const data = await res.json();
  return data;
};