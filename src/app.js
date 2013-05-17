(function(win, app, undef) {

var util = app.util,
	router = app._module.router.instance,
	navigate = app._module.navigate.instance,

	Page = app.page,
	Component = app.component,
	Navigation = app.navigation
	;

	function initComponent() {
		var viewport = app.config.viewport, 
			navibar, backBtn, funcBtn, content, toolbar;


		if (viewport) {
			navibar = viewport.querySelector('header.navibar');
			backBtn = navibar.querySelector('li:nth-child(2) button');
			funcBtn = navibar.querySelector('li:nth-child(3) button');
			content = viewport.querySelector('section.content');
			toolbar = viewport.querySelector('footer.toolbar');

			Component.initViewport(viewport);

			if (app.config.enableNavibar) {
				Component.initNavibar(navibar);
				Component.initBackBtn(backBtn);
				Component.initFuncBtn(funcBtn);
			}

			Component.initContent(content);

			if (app.config.enableScroll) {
				Component.initScroll(content);
			}

			if (app.config.enableTransition) {
				Component.initTransition(content);
			}

			if (app.config.enableToolbar) {
				Component.initToolbar();
			}
		}

	}

	function initNavigation() {
		var navibar = Component.get('navibar'),
			backBtn = Component.get('backBtn'),
			funcBtn = Component.get('funcBtn'),
			content = Component.get('content'),
			scroll = Component.get('scroll'),
			transition = Component.get('transition')
			;

		function backBtnClick() {
			navigate.backward();
		}

		Component.on('fillContentEnd', function() {
			scroll && scroll.fn.refresh();
		})

		function setButtons(navigation) {
			var pageName = navigation.pageName,
				page = Page.get(pageName),
				buttons = page.buttons
				;

			backBtn.fn.hide();
			funcBtn.fn.hide();

			buttons && util.each(buttons, function(item) {
				var type = item.type;

				switch (type) {
					case 'back':
						backBtn.fn.setText(item.text);
						backBtn.fn.handler = item.handler || backBtnClick;
						if (item.autoHide === false || 
								navigate.getStateIndex() >= 1) {
							backBtn.fn.show();
						}
						break;
					case 'func':
						funcBtn.fn.setText(item.text);
						funcBtn.fn.handler = item.handler;
						funcBtn.fn.show();
						break;
					default:
						break;
				}

				item.onChange && item.onChange.call(type==='back'?backBtn:funcBtn);
			});
		}

		function setNavibar(navigation, isMove) {
			var pageName = navigation.pageName,
				transition = navigation.state.transition,
				page = Page.get(pageName),
				title = page.getTitle() || ''
				;

			isMove ? navibar.fn.change(title, transition): 
				navibar.fn.set(title, transition);
		}

		function switchContent(navigation, callback) {
			if (app.config.enableTransition) {
				transition.fn[navigation.state.transition]();
				Component.once('forwardTransitionEnd backwardTransitionEnd', callback);
			} else {
				if (content) {
					content.fn.switchActive();
					content.fn.toggleClass();
				}
				callback();
			}
		}

		function switchNavigation(navigation) {
			if (app.navigation._cur) {
				app.navigation._cur.unload();
			}
			app.navigation._cur = navigation;
		}

		function loadNavigation(navigation) {
			navigation.load(function() {
				navigation.ready();
			});
		}

		navigate.on('forward backward', function (state) {
			var navigation = new Navigation(state)
				;

			switchNavigation(navigation);
			switchContent(navigation, function() {
				loadNavigation(navigation);	
			});
			if (app.config.enableNavibar) {
				setButtons(navigation);
				setNavibar(navigation, true);
			}
		});
	}

	util.extend(app, {
		config : {
			viewport : null,
			theme : 'iOS',
			routePrefix : 0, // 0 - no prefix, 1 - use app.name, 'any string' - use 'any string'
			routePrefixSep : '\/',
			enableNavibar : false,
			enableScroll : false,
			enableTransition : false,
			enableToolbar : false,
			templateEngine : null
		},
		plugin : {},

		start : function() {
			initComponent();
			initNavigation();
			app.plugin.init && app.plugin.init();
			router.start();
		}
	});

})(window, window['app']||(window['app']={}));
