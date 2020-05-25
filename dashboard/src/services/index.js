const axios = require("axios");
const jwt = require('jsonwebtoken');

const host = "http://ghaniza:3333";

export const getSales = async ( page = 1, {startDate, endDate}, token) => {
    const user = jwt.decode(token);
    const data = await axios.get(
        `${host}/sellers/${user.id}/list?page=${page}&startDate=${startDate}&endDate=${endDate}`,
        {
            headers: {
                Authorization: "Bearer " + token,
            }
        }
    )
    .then(response => {
        if(response.status === 200)
            return response.data;
    })
    .catch(console.log);

    return data;
}

export const getSaleCode = async ( page = 1, code, {startDate, endDate}, token) => {
    const data = await axios.get(
        `${host}/sellers/${code}/list?page=${page}&startDate=${startDate}&endDate=${endDate}`,
        {
            headers: {
                Authorization: "Bearer " + token,
            }
        }
    )
    .then(response => {
        if(response.status === 200)
            return response.data;
    })
    .catch(console.log);

    return data;
}

export const getSalesAll = async (page = 1, {startDate, endDate}, token) => {
    const data = await axios.get(
        `${host}/sales?page=${page}&startDate=${startDate}&endDate=${endDate}`,
        {
            headers: {
                Authorization: "Bearer " + token,
            }
        }
    )
    .then(response => {
        if(response.status === 200)
            return response.data;
    })
    .catch(console.log);

    return data;
}

export const login = async ({username, password}) => 
    axios.post(`${host}/login`, {username, password}, {
        validateStatus: function (status) {
            return status < 500;
          }
    });


export const addSale = async ( load = {}, token ) => {
    const user = jwt.decode(token);

    const body = {
        code: load.code,
        value: Number(load.value),
    }
    const data = await axios.post(`${host}/sellers/${user.id}/add`, body,
    {
        headers: {
            Authorization: "Bearer " + token,
        }
    }
    )
    .then(response => {
        if(response.status === 200)
            return response.data;
    })
    .catch(console.log);

    return data;
}

export const addSeller = async ( load = {}, token ) => {
    const body = {
        code: load.code,
        role: load.role,
        name: load.name,
        password: load.password,
    }
    const data = await axios.post(`${host}/sellers`, body,
    {
        headers: {
            Authorization: "Bearer " + token,
        }
    }
    )
    .then(response => {
        if(response.status === 200)
            return response.data;
    })
    .catch(console.log);

    return data;
}

export const getResetCode = async ( {username}, token ) => {
    const data = await axios.post(`${host}/reset-code`, {username},
    {
        headers: {
            Authorization: "Bearer " + token,
        }
    })
    .then(response => {
        if(response.status === 200)
            return response.data;
    })
    .catch(console.log);

    return data;
}

export const resetPassword = async ( {username, code, password}) => 
    axios.post(`${host}/reset-password`, {username, code, password});

export const deleteSales = async ( sales = [], token) => {
    await Promise.all(sales.map(async sale => {
        return await axios.delete(`${host}/sales/${sale.id}`,
        {
            headers: {
                Authorization: "Bearer " + token,
            }
        }
        )
        .then(response => {
            if(response.status === 204)
                return;
        })
        .catch(console.log);
    }));

    return;
}

export const alterSales = async ( sales = [], token) => {
    await Promise.all(sales.map(async sale => {
        return await axios.patch(`${host}/sales/${sale.id}`, sale,
        {
            headers: {
                Authorization: "Bearer " + token,
            }
        })
        .then(response => {
            if(response.status === 204)
                return;
        })
        .catch(console.log);
    }));

    return;
}

export const paySales = async ( sales = [], token) => {
    await Promise.all(sales.map(async sale => {
        return await axios.patch(
        `${host}/sales/${sale.id}`,
        {
            paid: true
        },{
            headers: {
                Authorization: "Bearer " + token,
            }
        })
        .then(response => {
            if(response.status === 200)
                return;
        })
        .catch(console.log);
    }));

    return;
}

export const getSellers = async ( page = 1, {startDate, endDate}, token) => {
    const data = await axios.get(
        `${host}/sellers?page=${page}&startDate=${startDate}&endDate=${endDate}`,
        {
            headers: {
                Authorization: "Bearer " + token,
            }
        }
    )
    .then(response => {
        if(response.status === 200)
            return response.data;
    })
    .catch(console.log);

    return data;
}

export const deleteSellers = async ( sellers = [], token) => {
    await Promise.all(sellers.map(async seller => {
        return await axios.delete(`${host}/sellers/${seller.id}`, {
            headers: {
                Authorization: "Bearer " + token,
            }
        })
        .then(response => {
            if(response.status === 204);
                return;
        })
        .catch(console.log);
    }));

    return;
}