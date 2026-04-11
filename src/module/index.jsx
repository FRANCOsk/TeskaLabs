import { Module } from "asab_webui_components";

import { TableScreen } from './TableScreen.jsx';
import { DetailScreen } from './DetailScreen.jsx';
import { UserExplorerScreen} from './UserExplorerScreen.jsx';


export default class TableApplicationModule extends Module {
	constructor(app, name) {
		super(app, "TableApplicationModule");

		app.Router.addRoute({
			path: "/",
			end: false,
			name: 'Table',
			component: TableScreen,
		});

       app.Router.addRoute({

		path: '/detail/:id',
        component: DetailScreen,

	   })

	   app.Router.addRoute({
			path: '/users-explorer',
			name: 'User Explorer',
			component: UserExplorerScreen,
});
	


		app.Navigation.addItem({
			name: "Table",
			icon: 'bi bi-table',
			url: "/",
		});

        app.Navigation.addItem({
			name: 'User Explorer',
			icon: 'bi bi-people',
			url: '/users-explorer',
});

	}
}
