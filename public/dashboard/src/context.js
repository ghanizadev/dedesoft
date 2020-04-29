import React, {useState} from 'react';
import PropTypes from 'prop-types';

const config = {
	context: {
		sales: {
            data: {
				docs: []
			},
            startDate: "",
            endDate: "",
        },
        sellers: {
            data: {
				docs: []
			},
            startDate: "",
            endDate: "",
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