const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;
console.log("^^^^^Fetching Funcs^^^^^")
console.log(baseUrl)

// ServerSideRender
export const getDataSSR = async (url, header) => {
  console.log("@@@GETDATASSR@@@")
  const res = await fetch(`${baseUrl}/api${url}`, {
    method: 'GET',
    headers: header
  });
  const data = await res.json();
  console.log("my ~~~~~~~~~~~~~~~~~~~ dafta")
  console.log(data)
  return data;
};

// GetServerSideProps (MAY REMOVE)
export const getDataGSSP = async (url, header) => {
  console.log("@@@GSSP@@@")
  const res = await fetch(`${baseUrl}/api${url}`, {
    method: 'GET',
    headers: header
  });
  const data = await res.json();
  return data;
};

export const getData = async (url) => {
  console.log("+++GET_URL+++")
  console.log(url)
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
  console.log("+++POST_URL+++")
  console.log(url)
  console.log("----------")
  console.log("postData")
  console.log(postData)
  console.log("----------")
  const res = await fetch(`${baseUrl}/api${url}`, {
    method: 'POST',
    // mode: 'cors',
    // cache: 'no-cache',
    credentials: 'include',
    // credentials: 'same-origin',
    body: postData
  });
  console.log("+|+|++|+|+|+|+|++|+|+")
  console.log("returning data via fetch to project service")
  const data = await res.json();
  console.log(data)
  console.log("+|+|++|+|+|+|+|++|+|+")
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
/* ORIGINAL
export const deleteData = async (url, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
};
*/

export const deleteData = async (url) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'DELETE',
    mode: 'cors',
    // cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(deleteData)
  });
  const data = await res.json();
  return data;
};

/*
export const getData = async (url, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'GET',
    headers: {
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
};

export const postData = async (url, post, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });
  const data = await res.json();
  return data;
};

export const putData = async (url, post, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });
  const data = await res.json();
  return data;
};

export const patchData = async (url, post, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });
  const data = await res.json();
  return data;
};

export const deleteData = async (url, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  const data = await res.json();
  return data;
};
*/
/*
const fetchFromApi = (path, method, accessToken) => {
  const url = (new URL(path, self.location)).href;

  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },

    method: method,
    credentials: 'include',
  }).then(res => {
    if (res.ok) {
      return res;
    } else {
      throw new Error(res.status);
    }
  }).then(res => res.json());
};
*/