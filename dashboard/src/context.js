import React, {useState} from 'react';
import PropTypes from 'prop-types';

const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

function pad(number) {
	if (number < 10) {
	return '0' + number;
	}
	return number;
}

function formatDate (date) {
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const config = {
	context: {
		sales: {
            data: {
				docs: [],
				totalSales: 0,
				totalPaid: 0,
				totalOpen: 0,
				comission: 0,
			},
            startDate: formatDate(firstDay),
            endDate: formatDate(lastDay),
        },
        sellers: {
            data: {
				docs: []
			},
            startDate: formatDate(firstDay),
            endDate: formatDate(lastDay),
        }
	},
	setContext: () => {},
};

const Context = React.createContext(config);

const Provider = props =>{
	const setContext = (newConfig) => {
		setState({...state, context: newConfig});
	};
    
	const [state, setState] = useState({...config, setContext});

	return (
		<Context.Provider value={state}>
			{props.children}
		</Context.Provider>
	);
};

const Consumer = props => 
	<Context.Consumer>
		{props.children}
	</Context.Consumer>;

Consumer.propTypes = {
	children: PropTypes.any.isRequired
};

Provider.propTypes = {
	children: PropTypes.any.isRequired
};

export {Context, Provider, Consumer};