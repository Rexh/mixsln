(function(e,t){var n=t.module.View,a=t.module.Page;n.fn.delegateEvents=a.fn.delegateEvents=function(e){var t=this.$el,n=this;t&&e.forEach(function(e){n[e[2]]&&(e[2]=n[e[2]]),t&&t.on(e[0],e[1],function(){e[2].apply(n,arguments)})})},n.fn.undelegateEvents=a.fn.undelegateEvents=function(){this.$el&&this.$el.off()},t.plugin.domevent={onPageStartup:function(e){e.events&&e.delegateEvents(e.events)},onPageTeardown:function(e){e.undelegateEvents()},onViewRender:function(e){!e._isDelegateEvents&&e.events&&(e._isDelegateEvents=!0,e.delegateEvents(e.events))},onViewDestory:function(e){e.undelegateEvents(),e._isDelegateEvents=!1}}})(window,window.app);