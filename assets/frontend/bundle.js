
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    let running = false;
    function run_tasks() {
        tasks.forEach(task => {
            if (!task[0](now())) {
                tasks.delete(task);
                task[1]();
            }
        });
        running = tasks.size > 0;
        if (running)
            raf(run_tasks);
    }
    function loop(fn) {
        let task;
        if (!running) {
            running = true;
            raf(run_tasks);
        }
        return {
            promise: new Promise(fulfil => {
                tasks.add(task = [fn, fulfil]);
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function add_resize_listener(element, fn) {
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        const object = document.createElement('object');
        object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        object.type = 'text/html';
        object.tabIndex = -1;
        let win;
        object.onload = () => {
            win = object.contentDocument.defaultView;
            win.addEventListener('resize', fn);
        };
        if (/Trident/.test(navigator.userAgent)) {
            element.appendChild(object);
            object.data = 'about:blank';
        }
        else {
            object.data = 'about:blank';
            element.appendChild(object);
        }
        return {
            cancel: () => {
                win && win.removeEventListener && win.removeEventListener('resize', fn);
                element.removeChild(object);
            }
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(html, anchor = null) {
            this.e = element('div');
            this.a = anchor;
            this.u(html);
        }
        m(target, anchor = null) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(target, this.n[i], anchor);
            }
            this.t = target;
        }
        u(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        p(html) {
            this.d();
            this.u(html);
            this.m(this.t, this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const historyStore = writable([]);

    function historyStoreAdd( state ){
      historyStore.update(h => [...h, state]);
    }
    function historyStoreReplaceLast( state ){
      historyStore.update( h => {
        h[h.length-1] = state;
        return h;
      });
    }
    function historyStoreRemoveLast(){
      historyStore.update( h => {
    		h.pop();
    		return h;
    	});
    }

    const pageStore = writable({
    	title: document.title,
    	url: window.location.href
    });

    function pageStoreSet( pageObject ){
    	pageStore.set( pageObject );
    }

    function pageStoreReplaceProperties( properties ){
    	pageStore.update( page => {
    		for (var key in properties) {
    			page[key] = properties[key];
    		}
    		return page;
    	});
    }

    function createStateObject( obj ){
      return {
        url: obj.url,
        title: obj.title || obj.url.split('/').pop(),
        template: obj.template || false,
        worlditem: obj.worlditem || false
      };
    }

    function assumeTemplate( pathname ){
      if( pathname === '' || pathname === '/' ){
        return false;
      } else if( pathname.match(/^\/?archive\/.+\/.+/) ){
    		return 'entity';
    	} else if( pathname.match(/^\/?archive.*/) ){
    		return 'archive';
    	}
    	return false;
    }

    function assumeTitle( href ){

    	// from query
    	let matches = href.search.match(/research=([^&]*)/);
    	if( matches ){
    		return matches[0].replace('research=','');
    	}

    	// from last slug
    	if( href.pathname ){
    		let slugs = href.pathname.split('/');
    		return slugs.pop();
    	}

    	return '';

    }

    function readHeader( header ){
    	if( header.includes('json') ){
    		 return 'json';
    	}
    	return 'html';
    }

    async function loadData( url ){

    	url = url.replace( '.json', '' );

    	const location = new URL( url );
    	url = location.origin + '/get' + location.pathname + location.search;

    	console.log( 'loadData( '+url+' )' );
    	const response = await fetch( url );

    	if (!response.ok) {
    		console.error("HTTP-Error: " + response.status);
    		return false;
    	}

    	let format = readHeader( response.headers.get('content-type') );
    	let data = {};

    	if( format === 'json' ){
    		data = await response.json();
    	} else {
    		data.data = {};
    		data.data.html = await response.text();
    	}

    	return data.data;
    }

    let loading = false;

    async function navigateTo( url, target = {}, replace = false ) {
    	if( loading === true ){
    		console.log('navigateTo() already loading');
    		return false;
    	}
    	if( url === window.location.href ){
    		return false;
    	}
    	const href = new URL( url );
    	if( href.host !== window.location.host ){
    		window.open( href, '_blank' );
    		return;
    	}

    	loading = true;

    	target.url = url;
    	target.template = target.template || assumeTemplate( href.pathname );
    	target.title = target.title || assumeTitle( href );

    	let state = createStateObject( target );

    	// use info provided by page object for

    	pageStoreSet({...target, loading: true});

    	if( replace === false ){
    		history.pushState( state, state.title, state.url);
    	} else {
    		history.replaceState( state, state.title, state.url);
    	}

    	historyStoreAdd( state );

    	// load data
    	let data = await loadData( url );

    	let classlist = ['dynamic'];
    	if( data.html ){
    		data.url = state.url;
    		data.title = state.title;
    		data.template = 'html';
    		classlist = [...classlist, 'reqular', 'black'];
    	} else {
    		state = createStateObject( data );
    		// let classlist = ['dynamic', data.theme, data.layout, data.template, data.entity, data.type, data.category ];
    		classlist = [...classlist, data.theme, data.layout, data.template, data.type, data.entity ];
    	}

    	// replace info in page object and history
    	pageStoreSet({...data , loading: false });

    	// naviWorld( entity.worlditem );

    	history.replaceState( state, data.title, data.url );
    	historyStoreReplaceLast( state );

    	document.body.className = classlist.join(' ');

    	loading = false;
    }

    let loading$1 = false;

    async function replaceContent( url, target = {}, replace = false ) {
    	if( loading$1 === true ){
    		console.log('replaceContent() already loading');
    		return false;
    	}
    	if( url === window.location.href ){
    		return false;
    	}

    	console.log('REPLAAAACE');

    	const href = new URL( url );

    	loading$1 = true;
    	let state = history.state;

    	state.url = url;
    	state.title = target.title || assumeTitle( href );
    	state.worlditem = target.worlditem || false;

    	// use info provided by page object for

    	pageStoreReplaceProperties({...target, loading: true});

    	if( replace === false ){
    		historyStoreAdd( state );
    		history.pushState( state, state.title, state.url);
    	} else {
    		historyStoreReplaceLast( state );
    		history.replaceState( state, state.title, url );
    	}

    	// load data
    	let data = await loadData( url );

    	state.title = data.title;
    	state.worlditem = data.worlditem;

    	window.goToItem( data.worlditem );

    	pageStoreReplaceProperties({
    		...state,
    		id: data.id,
    		category: data.category,
    		keywords: data.keywords,
    		description: data.description,
    		content: data.content,
    		pagination: data.pagination || false,
    		loading: false
    	});
    	historyStoreReplaceLast( state );
    	history.replaceState( state, state.title, state.url );

    	loading$1 = false;
    }

    /* src/router/Link.svelte generated by Svelte v3.12.1 */

    const file = "src/router/Link.svelte";

    function create_fragment(ctx) {
    	var a, t_value = ctx.target.title + "", t, a_href_value, a_title_value, current, dispose;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			a = element("a");

    			if (!default_slot) {
    				t = text(t_value);
    			}

    			if (default_slot) default_slot.c();

    			attr_dev(a, "href", a_href_value = ctx.target.url);
    			attr_dev(a, "title", a_title_value = ctx.target.title);
    			attr_dev(a, "class", ctx.classList);
    			toggle_class(a, "current", ctx.target.url === window.location.href);
    			add_location(a, file, 31, 0, 829);
    			dispose = listen_dev(a, "click", prevent_default(ctx.onClick), false, true);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(a_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target_1, anchor) {
    			insert_dev(target_1, a, anchor);

    			if (!default_slot) {
    				append_dev(a, t);
    			}

    			else {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!default_slot) {
    				if ((!current || changed.target) && t_value !== (t_value = ctx.target.title + "")) {
    					set_data_dev(t, t_value);
    				}
    			}

    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}

    			if ((!current || changed.target) && a_href_value !== (a_href_value = ctx.target.url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((!current || changed.target) && a_title_value !== (a_title_value = ctx.target.title)) {
    				attr_dev(a, "title", a_title_value);
    			}

    			if (!current || changed.classList) {
    				attr_dev(a, "class", ctx.classList);
    			}

    			if ((changed.classList || changed.target)) {
    				toggle_class(a, "current", ctx.target.url === window.location.href);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}

    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	
      const dispatch = createEventDispatcher();

      let { target = {}, url = false, title = false, template = false } = $$props;

      $$invalidate('target', target.url = url || target.url, target);
      $$invalidate('target', target.title = title || target.title, target);
      $$invalidate('target', target.template = template || target.template, target);

      let { replace = false, class: classList = '' } = $$props;

      function onClick(event) {
        if( target.worlditem && document.body.classList.contains('liebling-house') ){
          replaceContent( target.url, target, replace);
        } else {
          navigateTo( target.url, target, replace);
        }
        dispatch('click', event);
      }

    	const writable_props = ['target', 'url', 'title', 'template', 'replace', 'class'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('target' in $$props) $$invalidate('target', target = $$props.target);
    		if ('url' in $$props) $$invalidate('url', url = $$props.url);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('template' in $$props) $$invalidate('template', template = $$props.template);
    		if ('replace' in $$props) $$invalidate('replace', replace = $$props.replace);
    		if ('class' in $$props) $$invalidate('classList', classList = $$props.class);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { target, url, title, template, replace, classList };
    	};

    	$$self.$inject_state = $$props => {
    		if ('target' in $$props) $$invalidate('target', target = $$props.target);
    		if ('url' in $$props) $$invalidate('url', url = $$props.url);
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('template' in $$props) $$invalidate('template', template = $$props.template);
    		if ('replace' in $$props) $$invalidate('replace', replace = $$props.replace);
    		if ('classList' in $$props) $$invalidate('classList', classList = $$props.classList);
    	};

    	return {
    		target,
    		url,
    		title,
    		template,
    		replace,
    		classList,
    		onClick,
    		$$slots,
    		$$scope
    	};
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["target", "url", "title", "template", "replace", "class"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Link", options, id: create_fragment.name });
    	}

    	get target() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get template() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set template(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/navigation/historyBar.svelte generated by Svelte v3.12.1 */

    const file$1 = "src/components/navigation/historyBar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (41:6) {#each list as item}
    function create_each_block(ctx) {
    	var li, t, li_class_value, current;

    	var link = new Link({
    		props: { target: ctx.item },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			li = element("li");
    			link.$$.fragment.c();
    			t = space();
    			attr_dev(li, "class", li_class_value = ctx.item.double ? 'double' : '');
    			add_location(li, file$1, 41, 8, 913);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			append_dev(li, t);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.list) link_changes.target = ctx.item;
    			link.$set(link_changes);

    			if ((!current || changed.list) && li_class_value !== (li_class_value = ctx.item.double ? 'double' : '')) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			destroy_component(link);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(41:6) {#each list as item}", ctx });
    	return block;
    }

    function create_fragment$1(ctx) {
    	var nav, h3, a, t_1, ol, div, div_resize_listener, ol_resize_listener, ol_class_value, current;

    	let each_value = ctx.list;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			h3 = element("h3");
    			a = element("a");
    			a.textContent = "Start";
    			t_1 = space();
    			ol = element("ol");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(a, "href", window.location.origin);
    			attr_dev(a, "title", "Start");
    			add_location(a, file$1, 36, 4, 680);
    			add_location(h3, file$1, 35, 2, 671);
    			add_render_callback(() => ctx.div_resize_handler.call(div));
    			add_location(div, file$1, 39, 4, 842);
    			add_render_callback(() => ctx.ol_resize_handler.call(ol));
    			attr_dev(ol, "class", ol_class_value = ctx.innerWidth > ctx.outerWidth ? 'alignright' : '');
    			add_location(ol, file$1, 38, 2, 748);
    			attr_dev(nav, "class", "bar history horizontal white");
    			add_location(nav, file$1, 34, 0, 626);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, h3);
    			append_dev(h3, a);
    			append_dev(nav, t_1);
    			append_dev(nav, ol);
    			append_dev(ol, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			div_resize_listener = add_resize_listener(div, ctx.div_resize_handler.bind(div));
    			ol_resize_listener = add_resize_listener(ol, ctx.ol_resize_handler.bind(ol));
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.list) {
    				each_value = ctx.list;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}

    			if ((!current || changed.innerWidth || changed.outerWidth) && ol_class_value !== (ol_class_value = ctx.innerWidth > ctx.outerWidth ? 'alignright' : '')) {
    				attr_dev(ol, "class", ol_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(nav);
    			}

    			destroy_each(each_blocks, detaching);

    			div_resize_listener.cancel();
    			ol_resize_listener.cancel();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	

      let list;
      const unsubscribe = historyStore.subscribe(value => {
        if( value.length > 50 ){
    			value.splice(1,1);
    		}

        let doubles = [];

    		for( let i = value.length - 1; i >= 0; i--){
    			if( doubles.includes( value[i].url) ){
    				value[i].double = true;
    			} else {
            value[i].double = false;
    				doubles.push(value[i].url);
    			}
    		}

    		$$invalidate('list', list = value);
      });
      onDestroy(() => {
    		unsubscribe();
    	});

      let outerWidth, innerWidth;

      // ← →

    	function div_resize_handler() {
    		innerWidth = this.offsetWidth;
    		$$invalidate('innerWidth', innerWidth);
    	}

    	function ol_resize_handler() {
    		outerWidth = this.offsetWidth;
    		$$invalidate('outerWidth', outerWidth);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    		if ('outerWidth' in $$props) $$invalidate('outerWidth', outerWidth = $$props.outerWidth);
    		if ('innerWidth' in $$props) $$invalidate('innerWidth', innerWidth = $$props.innerWidth);
    	};

    	return {
    		list,
    		outerWidth,
    		innerWidth,
    		div_resize_handler,
    		ol_resize_handler
    	};
    }

    class HistoryBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "HistoryBar", options, id: create_fragment$1.name });
    	}
    }

    /* src/components/navigation/archiveBar.svelte generated by Svelte v3.12.1 */

    const file$2 = "src/components/navigation/archiveBar.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.keyword = list[i];
    	return child_ctx;
    }

    // (16:2) {#if page.keywords}
    function create_if_block(ctx) {
    	var div, current;

    	let each_value = ctx.page.keywords;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(div, "class", "right keywords");
    			add_location(div, file$2, 16, 4, 280);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.url || changed.page) {
    				each_value = ctx.page.keywords;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(16:2) {#if page.keywords}", ctx });
    	return block;
    }

    // (18:6) {#each page.keywords as keyword}
    function create_each_block$1(ctx) {
    	var current;

    	var link = new Link({
    		props: {
    		url: ctx.url+'?research='+ctx.keyword,
    		template: "archive",
    		title: ctx.keyword
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			link.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.page) link_changes.url = ctx.url+'?research='+ctx.keyword;
    			if (changed.page) link_changes.title = ctx.keyword;
    			link.$set(link_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(18:6) {#each page.keywords as keyword}", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var nav, div, t, current;

    	var link = new Link({
    		props: {
    		url: ctx.url,
    		title: "Archive",
    		template: "archive"
    	},
    		$$inline: true
    	});

    	var if_block = (ctx.page.keywords) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			link.$$.fragment.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "left");
    			add_location(div, file$2, 11, 2, 171);
    			attr_dev(nav, "class", "bar archive horizontal");
    			add_location(nav, file$2, 9, 0, 131);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			mount_component(link, div, null);
    			append_dev(nav, t);
    			if (if_block) if_block.m(nav, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.page.keywords) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(nav, null);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(nav);
    			}

    			destroy_component(link);

    			if (if_block) if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let url = location.origin + '/archive';

      let { page } = $$props;

    	const writable_props = ['page'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<ArchiveBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    	};

    	$$self.$capture_state = () => {
    		return { url, page };
    	};

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate('url', url = $$props.url);
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    	};

    	return { url, page };
    }

    class ArchiveBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["page"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "ArchiveBar", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.page === undefined && !('page' in props)) {
    			console.warn("<ArchiveBar> was created without expected prop 'page'");
    		}
    	}

    	get page() {
    		throw new Error("<ArchiveBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<ArchiveBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/collection/card.svelte generated by Svelte v3.12.1 */

    const file$3 = "src/components/collection/card.svelte";

    // (16:10) {#if item.thumbnail}
    function create_if_block_1(ctx) {
    	var html_tag, raw_value = ctx.item.thumbnail + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(raw_value, null);
    		},

    		m: function mount(target, anchor) {
    			html_tag.m(target, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.item) && raw_value !== (raw_value = ctx.item.thumbnail + "")) {
    				html_tag.p(raw_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				html_tag.d();
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1.name, type: "if", source: "(16:10) {#if item.thumbnail}", ctx });
    	return block;
    }

    // (23:10) {#if info}
    function create_if_block$1(ctx) {
    	var h5;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			add_location(h5, file$3, 22, 20, 538);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			h5.innerHTML = ctx.info;
    		},

    		p: function update(changed, ctx) {
    			if (changed.info) {
    				h5.innerHTML = ctx.info;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h5);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(23:10) {#if info}", ctx });
    	return block;
    }

    // (13:2) <Link target={item}>
    function create_default_slot(ctx) {
    	var figure, t0, div, span, t1_value = ctx.item.count || '' + "", t1, t2, h4, raw_value = ctx.item.title + "", t3;

    	var if_block0 = (ctx.item.thumbnail) && create_if_block_1(ctx);

    	var if_block1 = (ctx.info) && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div = element("div");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			h4 = element("h4");
    			t3 = space();
    			if (if_block1) if_block1.c();
    			add_location(figure, file$3, 14, 6, 313);
    			attr_dev(span, "class", "count");
    			add_location(span, file$3, 20, 10, 434);
    			add_location(h4, file$3, 21, 10, 490);
    			attr_dev(div, "class", "title");
    			add_location(div, file$3, 18, 6, 403);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			if (if_block0) if_block0.m(figure, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			append_dev(div, h4);
    			h4.innerHTML = raw_value;
    			append_dev(div, t3);
    			if (if_block1) if_block1.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.item.thumbnail) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(figure, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((changed.item) && t1_value !== (t1_value = ctx.item.count || '' + "")) {
    				set_data_dev(t1, t1_value);
    			}

    			if ((changed.item) && raw_value !== (raw_value = ctx.item.title + "")) {
    				h4.innerHTML = raw_value;
    			}

    			if (ctx.info) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(figure);
    			}

    			if (if_block0) if_block0.d();

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(div);
    			}

    			if (if_block1) if_block1.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot.name, type: "slot", source: "(13:2) <Link target={item}>", ctx });
    	return block;
    }

    function create_fragment$3(ctx) {
    	var li, li_class_value, current;

    	var link = new Link({
    		props: {
    		target: ctx.item,
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			li = element("li");
    			link.$$.fragment.c();
    			attr_dev(li, "class", li_class_value = "card " + ctx.classname + " " + ctx.item.classlist + " " + (ctx.width ? 'col-'+ctx.width : '') + " " + (ctx.item.thumbnail ? '' : 'no-thumb'));
    			add_location(li, file$3, 10, 0, 172);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.item) link_changes.target = ctx.item;
    			if (changed.$$scope || changed.info || changed.item) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);

    			if ((!current || changed.classname || changed.item || changed.width) && li_class_value !== (li_class_value = "card " + ctx.classname + " " + ctx.item.classlist + " " + (ctx.width ? 'col-'+ctx.width : '') + " " + (ctx.item.thumbnail ? '' : 'no-thumb'))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			destroy_component(link);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { item, width = false, info = false, classname = '' } = $$props;

    	const writable_props = ['item', 'width', 'info', 'classname'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('item' in $$props) $$invalidate('item', item = $$props.item);
    		if ('width' in $$props) $$invalidate('width', width = $$props.width);
    		if ('info' in $$props) $$invalidate('info', info = $$props.info);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    	};

    	$$self.$capture_state = () => {
    		return { item, width, info, classname };
    	};

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate('item', item = $$props.item);
    		if ('width' in $$props) $$invalidate('width', width = $$props.width);
    		if ('info' in $$props) $$invalidate('info', info = $$props.info);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    	};

    	return { item, width, info, classname };
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["item", "width", "info", "classname"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Card", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.item === undefined && !('item' in props)) {
    			console.warn("<Card> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/collection/cards.svelte generated by Svelte v3.12.1 */

    const file$4 = "src/components/collection/cards.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (25:2) {#each list as item}
    function create_each_block$2(ctx) {
    	var current;

    	var card = new Card({
    		props: { item: ctx.item, width: ctx.columnWidth },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			card.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var card_changes = {};
    			if (changed.list) card_changes.item = ctx.item;
    			if (changed.columnWidth) card_changes.width = ctx.columnWidth;
    			card.$set(card_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$2.name, type: "each", source: "(25:2) {#each list as item}", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var ul, current;

    	let each_value = ctx.list;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(ul, "class", "cards grid");
    			add_location(ul, file$4, 23, 0, 337);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.list || changed.columnWidth) {
    				each_value = ctx.list;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ul);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { list, columns = 2 } = $$props;
      let columnWidth = 12 / columns;
      beforeUpdate(() => {
        $$invalidate('columnWidth', columnWidth = 12 / columns);
        if( list.length < 4 ){
          if( columns == 2 ){

            $$invalidate('columnWidth', columnWidth = 12);

          }
        }
      });

    	const writable_props = ['list', 'columns'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Cards> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    		if ('columns' in $$props) $$invalidate('columns', columns = $$props.columns);
    	};

    	$$self.$capture_state = () => {
    		return { list, columns, columnWidth };
    	};

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    		if ('columns' in $$props) $$invalidate('columns', columns = $$props.columns);
    		if ('columnWidth' in $$props) $$invalidate('columnWidth', columnWidth = $$props.columnWidth);
    	};

    	return { list, columns, columnWidth };
    }

    class Cards extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["list", "columns"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Cards", options, id: create_fragment$4.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.list === undefined && !('list' in props)) {
    			console.warn("<Cards> was created without expected prop 'list'");
    		}
    	}

    	get list() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columns() {
    		throw new Error("<Cards>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Cards>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/collection/list.svelte generated by Svelte v3.12.1 */

    const file$5 = "src/components/collection/list.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (11:2) {#each list as item}
    function create_each_block$3(ctx) {
    	var current;

    	var card = new Card({
    		props: { item: ctx.item },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			card.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var card_changes = {};
    			if (changed.list) card_changes.item = ctx.item;
    			card.$set(card_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$3.name, type: "each", source: "(11:2) {#each list as item}", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var ul, current;

    	let each_value = ctx.list;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(ul, "class", "list");
    			add_location(ul, file$5, 9, 0, 109);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.list) {
    				each_value = ctx.list;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ul);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { list, category = false } = $$props;

    	const writable_props = ['list', 'category'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    	};

    	$$self.$capture_state = () => {
    		return { list, category };
    	};

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    	};

    	return { list, category };
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["list", "category"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "List", options, id: create_fragment$5.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.list === undefined && !('list' in props)) {
    			console.warn("<List> was created without expected prop 'list'");
    		}
    	}

    	get list() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/transcript.svelte generated by Svelte v3.12.1 */
    const { console: console_1 } = globals;

    const file$6 = "src/views/transcript.svelte";

    // (17:4) {#if transcript.en}
    function create_if_block_1$1(ctx) {
    	var div, h4, t_1, html_tag, raw_value = ctx.transcript.en + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "EN";
    			t_1 = space();
    			add_location(h4, file$6, 18, 12, 328);
    			html_tag = new HtmlTag(raw_value, null);
    			attr_dev(div, "class", "en col-sm-" + ctx.columnWidth());
    			add_location(div, file$6, 17, 8, 276);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t_1);
    			html_tag.m(div);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.transcript) && raw_value !== (raw_value = ctx.transcript.en + "")) {
    				html_tag.p(raw_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$1.name, type: "if", source: "(17:4) {#if transcript.en}", ctx });
    	return block;
    }

    // (23:4) {#if transcript.de}
    function create_if_block$2(ctx) {
    	var div, h4, t_1, html_tag, raw_value = ctx.transcript.de + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "DE";
    			t_1 = space();
    			add_location(h4, file$6, 24, 12, 483);
    			html_tag = new HtmlTag(raw_value, null);
    			attr_dev(div, "class", "de col-sm-" + ctx.columnWidth());
    			add_location(div, file$6, 23, 8, 431);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t_1);
    			html_tag.m(div);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.transcript) && raw_value !== (raw_value = ctx.transcript.de + "")) {
    				html_tag.p(raw_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$2.name, type: "if", source: "(23:4) {#if transcript.de}", ctx });
    	return block;
    }

    function create_fragment$6(ctx) {
    	var div, t;

    	var if_block0 = (ctx.transcript.en) && create_if_block_1$1(ctx);

    	var if_block1 = (ctx.transcript.de) && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "transcript grid");
    			add_location(div, file$6, 15, 0, 214);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.transcript.en) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.transcript.de) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$6.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { transcript } = $$props;

        console.log( transcript );

        function columnWidth(){
            if ( transcript.en && transcript.de ){
                return 6;
            }
            return 12;
        }

    	const writable_props = ['transcript'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1.warn(`<Transcript> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    	};

    	$$self.$capture_state = () => {
    		return { transcript };
    	};

    	$$self.$inject_state = $$props => {
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    	};

    	return { transcript, columnWidth };
    }

    class Transcript extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, ["transcript"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Transcript", options, id: create_fragment$6.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.transcript === undefined && !('transcript' in props)) {
    			console_1.warn("<Transcript> was created without expected prop 'transcript'");
    		}
    	}

    	get transcript() {
    		throw new Error("<Transcript>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transcript(value) {
    		throw new Error("<Transcript>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/video.svelte generated by Svelte v3.12.1 */

    const file$7 = "src/views/video.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.source = list[i];
    	return child_ctx;
    }

    // (29:0) {#if view.content.srcset.length > 0}
    function create_if_block$3(ctx) {
    	var section, div, t, section_resize_listener, section_class_value, current;

    	var if_block0 = (ctx.render === true) && create_if_block_2(ctx);

    	var if_block1 = (ctx.transcript) && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "section--content");
    			add_location(div, file$7, 32, 1, 602);
    			add_render_callback(() => ctx.section_resize_handler.call(section));
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type + " " + (ctx.transcript ? '' : 'center'));
    			add_location(section, file$7, 30, 0, 499);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(section, t);
    			if (if_block1) if_block1.m(section, null);
    			section_resize_listener = add_resize_listener(section, ctx.section_resize_handler.bind(section));
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.render === true) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.transcript) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				group_outros();
    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});
    				check_outros();
    			}

    			if ((!current || changed.classname || changed.view || changed.transcript) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type + " " + (ctx.transcript ? '' : 'center'))) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			section_resize_listener.cancel();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$3.name, type: "if", source: "(29:0) {#if view.content.srcset.length > 0}", ctx });
    	return block;
    }

    // (34:2) {#if render === true}
    function create_if_block_2(ctx) {
    	var video, video_poster_value, dispose;

    	let each_value = ctx.view.content.srcset;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			video = element("video");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(video, "width", "100%");
    			attr_dev(video, "height", "auto");
    			video.controls = true;
    			attr_dev(video, "preload", "metadata");
    			attr_dev(video, "poster", video_poster_value = ctx.view.content.poster);
    			add_location(video, file$7, 34, 3, 660);
    			dispose = listen_dev(video, "contextmenu", preventContextMenu);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, video, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(video, null);
    			}

    			ctx.video_binding(video);
    		},

    		p: function update(changed, ctx) {
    			if (changed.videoWidth || changed.view) {
    				each_value = ctx.view.content.srcset;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(video, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if ((changed.view) && video_poster_value !== (video_poster_value = ctx.view.content.poster)) {
    				attr_dev(video, "poster", video_poster_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(video);
    			}

    			destroy_each(each_blocks, detaching);

    			ctx.video_binding(null);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2.name, type: "if", source: "(34:2) {#if render === true}", ctx });
    	return block;
    }

    // (39:5) {#if videoWidth < source.width }
    function create_if_block_3(ctx) {
    	var source, source_type_value, source_media_value, source_src_value;

    	const block = {
    		c: function create() {
    			source = element("source");
    			attr_dev(source, "type", source_type_value = ctx.source.mime);
    			attr_dev(source, "media", source_media_value = ctx.source.media);
    			attr_dev(source, "src", source_src_value = ctx.source.url);
    			add_location(source, file$7, 39, 6, 908);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, source, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.view) && source_type_value !== (source_type_value = ctx.source.mime)) {
    				attr_dev(source, "type", source_type_value);
    			}

    			if ((changed.view) && source_media_value !== (source_media_value = ctx.source.media)) {
    				attr_dev(source, "media", source_media_value);
    			}

    			if ((changed.view) && source_src_value !== (source_src_value = ctx.source.url)) {
    				attr_dev(source, "src", source_src_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(source);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_3.name, type: "if", source: "(39:5) {#if videoWidth < source.width }", ctx });
    	return block;
    }

    // (38:4) {#each view.content.srcset as source}
    function create_each_block$4(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.videoWidth < ctx.source.width) && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.videoWidth < ctx.source.width) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$4.name, type: "each", source: "(38:4) {#each view.content.srcset as source}", ctx });
    	return block;
    }

    // (48:1) {#if transcript}
    function create_if_block_1$2(ctx) {
    	var current;

    	var transcript_1 = new Transcript({
    		props: { transcript: ctx.transcript },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			transcript_1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(transcript_1, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var transcript_1_changes = {};
    			if (changed.transcript) transcript_1_changes.transcript = ctx.transcript;
    			transcript_1.$set(transcript_1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(transcript_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(transcript_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(transcript_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$2.name, type: "if", source: "(48:1) {#if transcript}", ctx });
    	return block;
    }

    function create_fragment$7(ctx) {
    	var if_block_anchor, current;

    	var if_block = (ctx.view.content.srcset.length > 0) && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.view.content.srcset.length > 0) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$7.name, type: "component", source: "", ctx });
    	return block;
    }

    function preventContextMenu( e ){
    	e.preventDefault();
    	return false;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { view } = $$props;
    	let { transcript = false, classname = 'preview' } = $$props;

    	let mediaElement;

    	let videoWidth = 0;

    	let render = true;
    	function reMountVideo(){
    		// console.log('remount');
    		$$invalidate('render', render = false);
    		setTimeout(() => $$invalidate('render', render = true), 0);
    	}

    	const writable_props = ['view', 'transcript', 'classname'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Video> was created with unknown prop '${key}'`);
    	});

    	function video_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('mediaElement', mediaElement = $$value);
    		});
    	}

    	function section_resize_handler() {
    		videoWidth = this.offsetWidth;
    		$$invalidate('videoWidth', videoWidth);
    	}

    	$$self.$set = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    	};

    	$$self.$capture_state = () => {
    		return { view, transcript, classname, mediaElement, videoWidth, render };
    	};

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('mediaElement' in $$props) $$invalidate('mediaElement', mediaElement = $$props.mediaElement);
    		if ('videoWidth' in $$props) $$invalidate('videoWidth', videoWidth = $$props.videoWidth);
    		if ('render' in $$props) $$invalidate('render', render = $$props.render);
    	};

    	$$self.$$.update = ($$dirty = { view: 1 }) => {
    		if ($$dirty.view) { { reMountVideo( view.content.srcset[0].url ); } }
    	};

    	return {
    		view,
    		transcript,
    		classname,
    		mediaElement,
    		videoWidth,
    		render,
    		video_binding,
    		section_resize_handler
    	};
    }

    class Video extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, ["view", "transcript", "classname"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Video", options, id: create_fragment$7.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console.warn("<Video> was created without expected prop 'view'");
    		}
    	}

    	get view() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transcript() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transcript(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<Video>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<Video>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/audio.svelte generated by Svelte v3.12.1 */

    const file$8 = "src/views/audio.svelte";

    // (43:1) {#if transcript}
    function create_if_block$4(ctx) {
    	var current;

    	var transcript_1 = new Transcript({
    		props: { transcript: ctx.transcript },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			transcript_1.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(transcript_1, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var transcript_1_changes = {};
    			if (changed.transcript) transcript_1_changes.transcript = ctx.transcript;
    			transcript_1.$set(transcript_1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(transcript_1.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(transcript_1.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(transcript_1, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$4.name, type: "if", source: "(43:1) {#if transcript}", ctx });
    	return block;
    }

    function create_fragment$8(ctx) {
    	var section, div, audio, audio_src_value, t, section_class_value, current;

    	var if_block = (ctx.transcript) && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			audio = element("audio");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(audio, "width", "100%");
    			attr_dev(audio, "height", "auto");
    			audio.controls = true;
    			attr_dev(audio, "preload", "meta");
    			attr_dev(audio, "src", audio_src_value = ctx.view.content.url);
    			attr_dev(audio, "class", "svelte-lzdsfu");
    			add_location(audio, file$8, 37, 2, 551);
    			attr_dev(div, "class", "section--content svelte-lzdsfu");
    			add_location(div, file$8, 35, 1, 517);
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type + " " + (ctx.transcript ? '' : 'center') + " svelte-lzdsfu");
    			add_location(section, file$8, 33, 0, 444);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, audio);
    			ctx.audio_binding(audio);
    			append_dev(section, t);
    			if (if_block) if_block.m(section, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.view) && audio_src_value !== (audio_src_value = ctx.view.content.url)) {
    				attr_dev(audio, "src", audio_src_value);
    			}

    			if (ctx.transcript) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}

    			if ((!current || changed.classname || changed.view || changed.transcript) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type + " " + (ctx.transcript ? '' : 'center') + " svelte-lzdsfu")) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			ctx.audio_binding(null);
    			if (if_block) if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$8.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { view } = $$props;
    	let { transcript, classname = 'preview' } = $$props;

    	beforeUpdate(() => {
    		if( mediaElement === false ){
    			return;
    		}
    		mediaElement.pause();
    	});

    	let mediaElement = false;

    	const writable_props = ['view', 'transcript', 'classname'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Audio> was created with unknown prop '${key}'`);
    	});

    	function audio_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('mediaElement', mediaElement = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    	};

    	$$self.$capture_state = () => {
    		return { view, transcript, classname, mediaElement };
    	};

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('mediaElement' in $$props) $$invalidate('mediaElement', mediaElement = $$props.mediaElement);
    	};

    	return {
    		view,
    		transcript,
    		classname,
    		mediaElement,
    		audio_binding
    	};
    }

    class Audio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, ["view", "transcript", "classname"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Audio", options, id: create_fragment$8.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console.warn("<Audio> was created without expected prop 'view'");
    		}
    		if (ctx.transcript === undefined && !('transcript' in props)) {
    			console.warn("<Audio> was created without expected prop 'transcript'");
    		}
    	}

    	get view() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transcript() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transcript(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<Audio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<Audio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/collection/gallery.svelte generated by Svelte v3.12.1 */

    const file$9 = "src/components/collection/gallery.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (58:2) {:else}
    function create_else_block(ctx) {
    	var current;

    	var card = new Card({
    		props: {
    		item: ctx.item,
    		classname: "card-element",
    		width: ctx.columnWidth
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			card.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var card_changes = {};
    			if (changed.list) card_changes.item = ctx.item;
    			if (changed.columnWidth) card_changes.width = ctx.columnWidth;
    			card.$set(card_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(58:2) {:else}", ctx });
    	return block;
    }

    // (40:84) 
    function create_if_block_1$3(ctx) {
    	var li, t0, t1, li_class_value, current;

    	var switch_value = ctx.views[ ctx.item.view.type ];

    	function switch_props(ctx) {
    		return {
    			props: { view: ctx.item.view },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	var link = new Link({
    		props: {
    		target: ctx.item,
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			t0 = space();
    			link.$$.fragment.c();
    			t1 = space();
    			attr_dev(li, "class", li_class_value = "card preview " + ctx.item.classlist + " " + (ctx.columnWidth ? 'col-'+ctx.columnWidth : ''));
    			add_location(li, file$9, 42, 3, 939);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, li, null);
    			}

    			append_dev(li, t0);
    			mount_component(link, li, null);
    			append_dev(li, t1);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.list) switch_instance_changes.view = ctx.item.view;

    			if (switch_value !== (switch_value = ctx.views[ ctx.item.view.type ])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, li, t0);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			var link_changes = {};
    			if (changed.list) link_changes.target = ctx.item;
    			if (changed.$$scope || changed.list) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);

    			if ((!current || changed.list || changed.columnWidth) && li_class_value !== (li_class_value = "card preview " + ctx.item.classlist + " " + (ctx.columnWidth ? 'col-'+ctx.columnWidth : ''))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			if (switch_instance) destroy_component(switch_instance);

    			destroy_component(link);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$3.name, type: "if", source: "(40:84) ", ctx });
    	return block;
    }

    // (35:2) {#if category == 'tourstop' && item.worlditem !== null }
    function create_if_block$5(ctx) {
    	var current;

    	var card = new Card({
    		props: {
    		item: ctx.item,
    		classname: "list-element",
    		width: ctx.columnWidth
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			card.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var card_changes = {};
    			if (changed.list) card_changes.item = ctx.item;
    			if (changed.columnWidth) card_changes.width = ctx.columnWidth;
    			card.$set(card_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$5.name, type: "if", source: "(35:2) {#if category == 'tourstop' && item.worlditem !== null }", ctx });
    	return block;
    }

    // (47:4) <Link target={item} >
    function create_default_slot$1(ctx) {
    	var div, span, t0_value = ctx.item.count || '' + "", t0, t1, h4, raw_value = ctx.item.title + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			h4 = element("h4");
    			attr_dev(span, "class", "count");
    			add_location(span, file$9, 49, 7, 1155);
    			add_location(h4, file$9, 50, 7, 1208);
    			attr_dev(div, "class", "title");
    			add_location(div, file$9, 47, 5, 1127);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			append_dev(div, h4);
    			h4.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.list) && t0_value !== (t0_value = ctx.item.count || '' + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.list) && raw_value !== (raw_value = ctx.item.title + "")) {
    				h4.innerHTML = raw_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$1.name, type: "slot", source: "(47:4) <Link target={item} >", ctx });
    	return block;
    }

    // (34:2) {#each list as item}
    function create_each_block$5(ctx) {
    	var current_block_type_index, if_block, if_block_anchor, current;

    	var if_block_creators = [
    		create_if_block$5,
    		create_if_block_1$3,
    		create_else_block
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.category == 'tourstop' && ctx.item.worlditem !== null) return 0;
    		if (ctx.item.view && ( ctx.item.view.type == 'audio' || ctx.item.view.type == 'video' )) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$5.name, type: "each", source: "(34:2) {#each list as item}", ctx });
    	return block;
    }

    function create_fragment$9(ctx) {
    	var ul, ul_class_value, current;

    	let each_value = ctx.list;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(ul, "class", ul_class_value = "gallery " + (ctx.columns !== 1 ? 'grid' : ''));
    			add_location(ul, file$9, 32, 0, 572);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.category || changed.list || changed.columnWidth || changed.views) {
    				each_value = ctx.list;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}

    			if ((!current || changed.columns) && ul_class_value !== (ul_class_value = "gallery " + (ctx.columns !== 1 ? 'grid' : ''))) {
    				attr_dev(ul, "class", ul_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ul);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$9.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	

      let { list, category = '' } = $$props;

    	let views = {
    		'video': Video,
    		'audio': Audio,
    	};

    	let { columns = 1 } = $$props;
      let columnWidth = 12 / columns;
    	beforeUpdate(() => {
        $$invalidate('columnWidth', columnWidth = 12 / columns);
        if( list.length < 4 ){
          if( columns == 2 ){

            $$invalidate('columnWidth', columnWidth = 12);

          }
        }
      });

    	const writable_props = ['list', 'category', 'columns'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    		if ('columns' in $$props) $$invalidate('columns', columns = $$props.columns);
    	};

    	$$self.$capture_state = () => {
    		return { list, category, views, columns, columnWidth };
    	};

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    		if ('views' in $$props) $$invalidate('views', views = $$props.views);
    		if ('columns' in $$props) $$invalidate('columns', columns = $$props.columns);
    		if ('columnWidth' in $$props) $$invalidate('columnWidth', columnWidth = $$props.columnWidth);
    	};

    	return {
    		list,
    		category,
    		views,
    		columns,
    		columnWidth
    	};
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, ["list", "category", "columns"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Gallery", options, id: create_fragment$9.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.list === undefined && !('list' in props)) {
    			console.warn("<Gallery> was created without expected prop 'list'");
    		}
    	}

    	get list() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columns() {
    		throw new Error("<Gallery>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Gallery>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/collection.svelte generated by Svelte v3.12.1 */

    const file$a = "src/views/collection.svelte";

    // (75:2) {#if view.next || loading === true}
    function create_if_block_1$4(ctx) {
    	var div;

    	function select_block_type(changed, ctx) {
    		if (ctx.loading === true) return create_if_block_2$1;
    		return create_else_block$1;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "load-more");
    			add_location(div, file$a, 75, 3, 1543);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type !== (current_block_type = select_block_type(changed, ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$4.name, type: "if", source: "(75:2) {#if view.next || loading === true}", ctx });
    	return block;
    }

    // (79:4) {:else}
    function create_else_block$1(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Load more";
    			attr_dev(button, "class", "card");
    			add_location(button, file$a, 79, 5, 1647);
    			dispose = listen_dev(button, "click", ctx.loadNext);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$1.name, type: "else", source: "(79:4) {:else}", ctx });
    	return block;
    }

    // (77:4) {#if loading === true}
    function create_if_block_2$1(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "is-loading");
    			add_location(div, file$a, 77, 5, 1599);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$1.name, type: "if", source: "(77:4) {#if loading === true}", ctx });
    	return block;
    }

    // (87:1) {#if controls }
    function create_if_block$6(ctx) {
    	var div2, div0, span0, t1, button0, t3, button1, t5, div1, span1, t6_value = ctx.view.total + "", t6, t7, dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Display as:";
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Cards";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "List";
    			t5 = space();
    			div1 = element("div");
    			span1 = element("span");
    			t6 = text(t6_value);
    			t7 = text(" Results");
    			add_location(span0, file$a, 90, 4, 1826);
    			add_location(button0, file$a, 91, 4, 1855);
    			add_location(button1, file$a, 92, 4, 1918);
    			attr_dev(div0, "class", "left display");
    			add_location(div0, file$a, 89, 3, 1795);
    			add_location(span1, file$a, 96, 4, 2018);
    			attr_dev(div1, "class", "right info");
    			add_location(div1, file$a, 95, 3, 1989);
    			attr_dev(div2, "class", "bar controls");
    			add_location(div2, file$a, 87, 2, 1764);

    			dispose = [
    				listen_dev(button0, "click", ctx.click_handler),
    				listen_dev(button1, "click", ctx.click_handler_1)
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, button0);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, span1);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.view) && t6_value !== (t6_value = ctx.view.total + "")) {
    				set_data_dev(t6, t6_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div2);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$6.name, type: "if", source: "(87:1) {#if controls }", ctx });
    	return block;
    }

    function create_fragment$a(ctx) {
    	var section, div, t0, div_resize_listener, t1, section_class_value, current, dispose;

    	var switch_value = ctx.layouts[ctx.layout];

    	function switch_props(ctx) {
    		return {
    			props: {
    			list: ctx.view.content,
    			columns: ctx.columns
    		},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	var if_block0 = (ctx.view.next || ctx.loading === true) && create_if_block_1$4(ctx);

    	var if_block1 = (ctx.controls) && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			add_render_callback(() => ctx.div_resize_handler.call(div));
    			attr_dev(div, "class", "section--content svelte-1mm2wm5");
    			add_location(div, file$a, 70, 1, 1361);
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type + " svelte-1mm2wm5");
    			add_location(section, file$a, 68, 0, 1261);
    			dispose = listen_dev(section, "scroll", ctx.scrollTrigger, { passive: true });
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			div_resize_listener = add_resize_listener(div, ctx.div_resize_handler.bind(div));
    			append_dev(section, t1);
    			if (if_block1) if_block1.m(section, null);
    			ctx.section_binding(section);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.view) switch_instance_changes.list = ctx.view.content;
    			if (changed.columns) switch_instance_changes.columns = ctx.columns;

    			if (switch_value !== (switch_value = ctx.layouts[ctx.layout])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t0);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (ctx.view.next || ctx.loading === true) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$4(ctx);
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.controls) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if ((!current || changed.classname || changed.view) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type + " svelte-1mm2wm5")) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			if (switch_instance) destroy_component(switch_instance);
    			if (if_block0) if_block0.d();
    			div_resize_listener.cancel();
    			if (if_block1) if_block1.d();
    			ctx.section_binding(null);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$a.name, type: "component", source: "", ctx });
    	return block;
    }

    let offset = 4000;

    function instance$a($$self, $$props, $$invalidate) {
    	

    	let { transcript = false, view, classname, controls = false, columns = view.columns || 2 } = $$props;
    	let layouts = {
    		cards: Cards,
    		list: List,
    		gallery: Gallery
    	};
    	let { layout = 'cards' } = $$props;
    	afterUpdate(() => {
    		if( "layout" in view ){
    			$$invalidate('layout', layout = view.layout);
    		}
    	});

    	let loading = false;

    	async function loadNext(){

    		$$invalidate('loading', loading = true);

    		let data = await loadData( view.next );

    		if( data ){

    			$$invalidate('loading', loading = false);
    			$$invalidate('view', view.next = data.next, view);
    			$$invalidate('view', view.content = view.content.concat( data.content ), view);

    		}
    	}

    	let pageHeight = 100;
    	let container = 0;
    	let scrollPos = 0;

    	function scrollTrigger(){
    		if( view.next === false || loading === true ){
    			return;
    		}
    		scrollPos = container.scrollTop;
    		if( scrollPos > ( pageHeight - offset ) ){

    			loadNext();

    		}
    	}

    	const writable_props = ['transcript', 'view', 'classname', 'controls', 'columns', 'layout'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Collection> was created with unknown prop '${key}'`);
    	});

    	function div_resize_handler() {
    		pageHeight = this.clientHeight;
    		$$invalidate('pageHeight', pageHeight);
    	}

    	const click_handler = () => $$invalidate('layout', layout = 'cards');

    	const click_handler_1 = () => $$invalidate('layout', layout = 'list');

    	function section_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('container', container = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('controls' in $$props) $$invalidate('controls', controls = $$props.controls);
    		if ('columns' in $$props) $$invalidate('columns', columns = $$props.columns);
    		if ('layout' in $$props) $$invalidate('layout', layout = $$props.layout);
    	};

    	$$self.$capture_state = () => {
    		return { transcript, view, classname, controls, columns, layouts, layout, loading, pageHeight, offset, container, scrollPos };
    	};

    	$$self.$inject_state = $$props => {
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('controls' in $$props) $$invalidate('controls', controls = $$props.controls);
    		if ('columns' in $$props) $$invalidate('columns', columns = $$props.columns);
    		if ('layouts' in $$props) $$invalidate('layouts', layouts = $$props.layouts);
    		if ('layout' in $$props) $$invalidate('layout', layout = $$props.layout);
    		if ('loading' in $$props) $$invalidate('loading', loading = $$props.loading);
    		if ('pageHeight' in $$props) $$invalidate('pageHeight', pageHeight = $$props.pageHeight);
    		if ('offset' in $$props) offset = $$props.offset;
    		if ('container' in $$props) $$invalidate('container', container = $$props.container);
    		if ('scrollPos' in $$props) scrollPos = $$props.scrollPos;
    	};

    	return {
    		transcript,
    		view,
    		classname,
    		controls,
    		columns,
    		layouts,
    		layout,
    		loading,
    		loadNext,
    		pageHeight,
    		container,
    		scrollTrigger,
    		div_resize_handler,
    		click_handler,
    		click_handler_1,
    		section_binding
    	};
    }

    class Collection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, ["transcript", "view", "classname", "controls", "columns", "layout"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Collection", options, id: create_fragment$a.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console.warn("<Collection> was created without expected prop 'view'");
    		}
    		if (ctx.classname === undefined && !('classname' in props)) {
    			console.warn("<Collection> was created without expected prop 'classname'");
    		}
    	}

    	get transcript() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transcript(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get view() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get controls() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controls(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columns() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get layout() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set layout(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/templates/archive.svelte generated by Svelte v3.12.1 */
    const { console: console_1$1 } = globals;

    const file$b = "src/templates/archive.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (100:3) {#if page.archive && page.archive.filters}
    function create_if_block_4(ctx) {
    	var section, h2, t_1, ul;

    	let each_value = ctx.page.archive.filters.content;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Filter";
    			t_1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(h2, file$b, 101, 5, 2305);
    			attr_dev(ul, "class", "list");
    			add_location(ul, file$b, 102, 5, 2326);
    			attr_dev(section, "class", "filters tab");
    			add_location(section, file$b, 100, 4, 2270);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t_1);
    			append_dev(section, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.page || changed.archive) {
    				each_value = ctx.page.archive.filters.content;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_4.name, type: "if", source: "(100:3) {#if page.archive && page.archive.filters}", ctx });
    	return block;
    }

    // (104:6) {#each page.archive.filters.content as item}
    function create_each_block$6(ctx) {
    	var li, button, div, h4, raw_value = ctx.item.title + "", t, li_class_value, dispose;

    	function click_handler_1() {
    		return ctx.click_handler_1(ctx);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			div = element("div");
    			h4 = element("h4");
    			t = space();
    			add_location(h4, file$b, 109, 10, 2660);
    			attr_dev(div, "class", "title");
    			add_location(div, file$b, 106, 9, 2564);
    			add_location(button, file$b, 105, 8, 2477);
    			attr_dev(li, "class", li_class_value = "card " + (ctx.item.filter === ctx.archive.filter ? 'active' : ''));
    			add_location(li, file$b, 104, 7, 2402);
    			dispose = listen_dev(button, "click", click_handler_1);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, div);
    			append_dev(div, h4);
    			h4.innerHTML = raw_value;
    			append_dev(li, t);
    		},

    		p: function update(changed, new_ctx) {
    			ctx = new_ctx;
    			if ((changed.page) && raw_value !== (raw_value = ctx.item.title + "")) {
    				h4.innerHTML = raw_value;
    			}

    			if ((changed.page || changed.archive) && li_class_value !== (li_class_value = "card " + (ctx.item.filter === ctx.archive.filter ? 'active' : ''))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$6.name, type: "each", source: "(104:6) {#each page.archive.filters.content as item}", ctx });
    	return block;
    }

    // (123:1) {#if loading === true || page.loading}
    function create_if_block_3$1(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "is-loading");
    			add_location(div, file$b, 123, 2, 2847);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_3$1.name, type: "if", source: "(123:1) {#if loading === true || page.loading}", ctx });
    	return block;
    }

    // (127:1) {#if page.results}
    function create_if_block$7(ctx) {
    	var current_block_type_index, if_block, if_block_anchor, current;

    	var if_block_creators = [
    		create_if_block_1$5,
    		create_else_block$2
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.page.results.total === 0 && ctx.archive.query !== '') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$7.name, type: "if", source: "(127:1) {#if page.results}", ctx });
    	return block;
    }

    // (134:2) {:else}
    function create_else_block$2(ctx) {
    	var current;

    	var viewcollection = new Collection({
    		props: {
    		view: ctx.page.results,
    		classname: "presentation panel col-sm-9",
    		controls: true,
    		columns: "3"
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			viewcollection.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(viewcollection, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var viewcollection_changes = {};
    			if (changed.page) viewcollection_changes.view = ctx.page.results;
    			viewcollection.$set(viewcollection_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewcollection.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(viewcollection.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(viewcollection, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$2.name, type: "else", source: "(134:2) {:else}", ctx });
    	return block;
    }

    // (129:2) {#if page.results.total === 0 && archive.query !== '' }
    function create_if_block_1$5(ctx) {
    	var div, t0, t1_value = ctx.archive.query + "", t1, t2;

    	var if_block = (ctx.archive.filter) && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("No results for »");
    			t1 = text(t1_value);
    			t2 = text("«\n\t\t\t\t");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "panel col-sm-9 empty-results");
    			add_location(div, file$b, 129, 3, 2968);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.archive) && t1_value !== (t1_value = ctx.archive.query + "")) {
    				set_data_dev(t1, t1_value);
    			}

    			if (ctx.archive.filter) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (if_block) if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$5.name, type: "if", source: "(129:2) {#if page.results.total === 0 && archive.query !== '' }", ctx });
    	return block;
    }

    // (132:4) {#if archive.filter }
    function create_if_block_2$2(ctx) {
    	var t0, t1_value = ctx.archive.filter + "", t1;

    	const block = {
    		c: function create() {
    			t0 = text("in ");
    			t1 = text(t1_value);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.archive) && t1_value !== (t1_value = ctx.archive.filter + "")) {
    				set_data_dev(t1, t1_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(t1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$2.name, type: "if", source: "(132:4) {#if archive.filter }", ctx });
    	return block;
    }

    function create_fragment$b(ctx) {
    	var div1, main, div0, header, h1, t1, form, input, t2, t3, t4, current, dispose;

    	var if_block0 = (ctx.page.archive && ctx.page.archive.filters) && create_if_block_4(ctx);

    	var if_block1 = (ctx.loading === true || ctx.page.loading) && create_if_block_3$1(ctx);

    	var if_block2 = (ctx.page.results) && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			main = element("main");
    			div0 = element("div");
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Archive";
    			t1 = space();
    			form = element("form");
    			input = element("input");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			add_location(h1, file$b, 84, 4, 1787);
    			attr_dev(input, "class", "input");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "name", "research");
    			attr_dev(input, "autocomplete", "off");
    			attr_dev(input, "spellcheck", "false");
    			attr_dev(input, "autocorrect", "off");
    			attr_dev(input, "aria-label", "Search the archive ...");
    			attr_dev(input, "placeholder", "Search the archive ...");
    			add_location(input, file$b, 87, 5, 1886);
    			attr_dev(form, "id", "search");
    			attr_dev(form, "autocomplete", "off");
    			add_location(form, file$b, 86, 4, 1809);
    			attr_dev(header, "id", "top");
    			attr_dev(header, "class", "tab");
    			add_location(header, file$b, 83, 3, 1753);
    			attr_dev(div0, "class", "content");
    			add_location(div0, file$b, 81, 2, 1727);
    			attr_dev(main, "class", "panel col-sm-3");
    			add_location(main, file$b, 80, 1, 1695);
    			attr_dev(div1, "class", "grid panels");
    			add_location(div1, file$b, 78, 0, 1667);

    			dispose = [
    				listen_dev(input, "input", ctx.input_input_handler),
    				listen_dev(input, "input", ctx.input_handler),
    				listen_dev(form, "click", ctx.click_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, main);
    			append_dev(main, div0);
    			append_dev(div0, header);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, form);
    			append_dev(form, input);

    			set_input_value(input, ctx.archive.query);

    			ctx.input_binding(input);
    			append_dev(div0, t2);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t4);
    			if (if_block2) if_block2.m(div1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.archive) set_input_value(input, ctx.archive.query);

    			if (ctx.page.archive && ctx.page.archive.filters) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.loading === true || ctx.page.loading) {
    				if (!if_block1) {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (ctx.page.results) {
    				if (if_block2) {
    					if_block2.p(changed, ctx);
    					transition_in(if_block2, 1);
    				} else {
    					if_block2 = create_if_block$7(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();
    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block2);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block2);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div1);
    			}

    			ctx.input_binding(null);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$b.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	

    	let { page } = $$props;
    	let field;
    	let loading = false;

    	let archive = {
    		filter: false,
    		query: '',
    		previous: {
    			url: false
    		},
    		url: window.location.origin + '/archive',
    		wait: false,
    		input: function(){
    			clearTimeout( this.wait );
    			this.wait = setTimeout(() => {
    				this.search();
    			}, 250);
    		},
    		search: async function(){
    			$$invalidate('loading', loading = true);

    			let url = this.url;
    			if( this.filter ){
    				url += '/' + encodeURIComponent( this.filter );
    			}
    			if( this.query ){
    				url += '?research=' + encodeURIComponent( this.query );
    			}

    			if( url === this.previous.url ){
    				return false;
    			} else {
    				this.previous.url = url;
    			}

    			console.log( 'search '+url );

    			let state = history.state;
    			state.url = url;
    			history.replaceState( state, state.title, state.url );

    			// load data
    			let data = await loadData( url );
    			pageStoreReplaceProperties({ results: data.results });
    			$$invalidate('loading', loading = false);

    		}
    	};

    	const unsubscribe = pageStore.subscribe(value => {
    		// page = value;
    		if( value.archive ){
    			if( value.archive.filter ){
    				$$invalidate('archive', archive.filter = value.archive.filter, archive);
    			}
    			if( value.archive.query ){
    				$$invalidate('archive', archive.query = value.archive.query, archive);
    			}
    		}
    		if( value.loading === false ){
    			setTimeout(() => {
    				unsubscribe();
    			}, 5);
    		}
      });

    	const writable_props = ['page'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$1.warn(`<Archive> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		archive.query = this.value;
    		$$invalidate('archive', archive);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('field', field = $$value);
    		});
    	}

    	const input_handler = () => archive.input();

    	const click_handler = () => field.focus();

    	const click_handler_1 = ({ item }) => { $$invalidate('archive', archive.filter = item.filter, archive); archive.search(); };

    	$$self.$set = $$props => {
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    	};

    	$$self.$capture_state = () => {
    		return { page, field, loading, archive };
    	};

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    		if ('field' in $$props) $$invalidate('field', field = $$props.field);
    		if ('loading' in $$props) $$invalidate('loading', loading = $$props.loading);
    		if ('archive' in $$props) $$invalidate('archive', archive = $$props.archive);
    	};

    	return {
    		page,
    		field,
    		loading,
    		archive,
    		input_input_handler,
    		input_binding,
    		input_handler,
    		click_handler,
    		click_handler_1
    	};
    }

    class Archive extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, ["page"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Archive", options, id: create_fragment$b.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.page === undefined && !('page' in props)) {
    			console_1$1.warn("<Archive> was created without expected prop 'page'");
    		}
    	}

    	get page() {
    		throw new Error("<Archive>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Archive>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tabs/header.svelte generated by Svelte v3.12.1 */

    const file$c = "src/components/tabs/header.svelte";

    // (13:4) {#if tab.content.h2 }
    function create_if_block_1$6(ctx) {
    	var h2, raw_value = ctx.tab.content.h2 + "";

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			attr_dev(h2, "class", "subtitle");
    			add_location(h2, file$c, 13, 8, 206);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			h2.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && raw_value !== (raw_value = ctx.tab.content.h2 + "")) {
    				h2.innerHTML = raw_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$6.name, type: "if", source: "(13:4) {#if tab.content.h2 }", ctx });
    	return block;
    }

    // (17:4) {#if tab.content.p }
    function create_if_block$8(ctx) {
    	var div, raw_value = ctx.tab.content.p + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "highlight");
    			add_location(div, file$c, 17, 8, 299);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && raw_value !== (raw_value = ctx.tab.content.p + "")) {
    				div.innerHTML = raw_value;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$8.name, type: "if", source: "(17:4) {#if tab.content.p }", ctx });
    	return block;
    }

    function create_fragment$c(ctx) {
    	var header, h1, raw_value = ctx.tab.content.h1 + "", t0, t1;

    	var if_block0 = (ctx.tab.content.h2) && create_if_block_1$6(ctx);

    	var if_block1 = (ctx.tab.content.p) && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h1, "class", "title");
    			add_location(h1, file$c, 10, 4, 125);
    			attr_dev(header, "id", "top");
    			attr_dev(header, "class", "tab");
    			add_location(header, file$c, 8, 0, 90);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			h1.innerHTML = raw_value;
    			append_dev(header, t0);
    			if (if_block0) if_block0.m(header, null);
    			append_dev(header, t1);
    			if (if_block1) if_block1.m(header, null);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && raw_value !== (raw_value = ctx.tab.content.h1 + "")) {
    				h1.innerHTML = raw_value;
    			}

    			if (ctx.tab.content.h2) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					if_block0.m(header, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.tab.content.p) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    				} else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					if_block1.m(header, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(header);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$c.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { entity, tab, category } = $$props;

    	const writable_props = ['entity', 'tab', 'category'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('entity' in $$props) $$invalidate('entity', entity = $$props.entity);
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    	};

    	$$self.$capture_state = () => {
    		return { entity, tab, category };
    	};

    	$$self.$inject_state = $$props => {
    		if ('entity' in $$props) $$invalidate('entity', entity = $$props.entity);
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    	};

    	return { entity, tab, category };
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, ["entity", "tab", "category"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Header", options, id: create_fragment$c.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.entity === undefined && !('entity' in props)) {
    			console.warn("<Header> was created without expected prop 'entity'");
    		}
    		if (ctx.tab === undefined && !('tab' in props)) {
    			console.warn("<Header> was created without expected prop 'tab'");
    		}
    		if (ctx.category === undefined && !('category' in props)) {
    			console.warn("<Header> was created without expected prop 'category'");
    		}
    	}

    	get entity() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entity(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tab() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/collection/entityinfo.svelte generated by Svelte v3.12.1 */

    const file$d = "src/components/collection/entityinfo.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (10:4) {#each list as item}
    function create_each_block$7(ctx) {
    	var current;

    	var card = new Card({
    		props: { item: ctx.item, info: ctx.item.info },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			card.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var card_changes = {};
    			if (changed.list) card_changes.item = ctx.item;
    			if (changed.list) card_changes.info = ctx.item.info;
    			card.$set(card_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$7.name, type: "each", source: "(10:4) {#each list as item}", ctx });
    	return block;
    }

    function create_fragment$d(ctx) {
    	var ul, current;

    	let each_value = ctx.list;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(ul, "class", "entityinfo");
    			add_location(ul, file$d, 8, 0, 82);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.list) {
    				each_value = ctx.list;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ul);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$d.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { list } = $$props;

    	const writable_props = ['list'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Entityinfo> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    	};

    	$$self.$capture_state = () => {
    		return { list };
    	};

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate('list', list = $$props.list);
    	};

    	return { list };
    }

    class Entityinfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, ["list"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Entityinfo", options, id: create_fragment$d.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.list === undefined && !('list' in props)) {
    			console.warn("<Entityinfo> was created without expected prop 'list'");
    		}
    	}

    	get list() {
    		throw new Error("<Entityinfo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<Entityinfo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tabs/collection.svelte generated by Svelte v3.12.1 */

    const file$e = "src/components/tabs/collection.svelte";

    // (23:1) {#if tab.headline}
    function create_if_block$9(ctx) {
    	var h3, t_value = ctx.tab.headline + "", t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "section--header");
    			add_location(h3, file$e, 23, 5, 520);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && t_value !== (t_value = ctx.tab.headline + "")) {
    				set_data_dev(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h3);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$9.name, type: "if", source: "(23:1) {#if tab.headline}", ctx });
    	return block;
    }

    function create_fragment$e(ctx) {
    	var section, t, div, section_class_value, current;

    	var if_block = (ctx.tab.headline) && create_if_block$9(ctx);

    	var switch_value = ctx.layout[ ctx.tab.layout ];

    	function switch_props(ctx) {
    		return {
    			props: { list: ctx.tab.content, category: ctx.category },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block) if_block.c();
    			t = space();
    			div = element("div");
    			if (switch_instance) switch_instance.$$.fragment.c();
    			attr_dev(div, "class", "section--content");
    			add_location(div, file$e, 26, 4, 580);
    			attr_dev(section, "class", section_class_value = "tab collection " + ctx.tab.layout);
    			add_location(section, file$e, 20, 0, 448);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block) if_block.m(section, null);
    			append_dev(section, t);
    			append_dev(section, div);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.tab.headline) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(section, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			var switch_instance_changes = {};
    			if (changed.tab) switch_instance_changes.list = ctx.tab.content;
    			if (changed.category) switch_instance_changes.category = ctx.category;

    			if (switch_value !== (switch_value = ctx.layout[ ctx.tab.layout ])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if ((!current || changed.tab) && section_class_value !== (section_class_value = "tab collection " + ctx.tab.layout)) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$e.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { entity, tab, category } = $$props;

    	let layout = {
    		cards: Cards,
    		list: List,
    		entityinfo: Entityinfo,
    		gallery: Gallery
    	};

    	const writable_props = ['entity', 'tab', 'category'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Collection> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('entity' in $$props) $$invalidate('entity', entity = $$props.entity);
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    	};

    	$$self.$capture_state = () => {
    		return { entity, tab, category, layout };
    	};

    	$$self.$inject_state = $$props => {
    		if ('entity' in $$props) $$invalidate('entity', entity = $$props.entity);
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    		if ('layout' in $$props) $$invalidate('layout', layout = $$props.layout);
    	};

    	return { entity, tab, category, layout };
    }

    class Collection$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, ["entity", "tab", "category"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Collection", options, id: create_fragment$e.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.entity === undefined && !('entity' in props)) {
    			console.warn("<Collection> was created without expected prop 'entity'");
    		}
    		if (ctx.tab === undefined && !('tab' in props)) {
    			console.warn("<Collection> was created without expected prop 'tab'");
    		}
    		if (ctx.category === undefined && !('category' in props)) {
    			console.warn("<Collection> was created without expected prop 'category'");
    		}
    	}

    	get entity() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entity(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tab() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Collection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Collection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tabs/table.svelte generated by Svelte v3.12.1 */

    const file$f = "src/components/tabs/table.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.bit = list[i];
    	return child_ctx;
    }

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.line = list[i];
    	return child_ctx;
    }

    // (34:4) {#if open}
    function create_if_block$a(ctx) {
    	var dl, dl_transition, current;

    	let each_value = ctx.tab.content;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			dl = element("dl");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(dl, "class", "section--content table");
    			add_location(dl, file$f, 34, 6, 711);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, dl, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(dl, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.tab || changed.cellSize) {
    				each_value = ctx.tab.content;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(dl, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!dl_transition) dl_transition = create_bidirectional_transition(dl, slide, { duration: 200 }, true);
    				dl_transition.run(1);
    			});

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!dl_transition) dl_transition = create_bidirectional_transition(dl, slide, { duration: 200 }, false);
    			dl_transition.run(0);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(dl);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				if (dl_transition) dl_transition.end();
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$a.name, type: "if", source: "(34:4) {#if open}", ctx });
    	return block;
    }

    // (41:18) {:else}
    function create_else_block_1(ctx) {
    	var dt, t_value = ctx.line.key + "", t;

    	const block = {
    		c: function create() {
    			dt = element("dt");
    			t = text(t_value);
    			add_location(dt, file$f, 41, 22, 989);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, dt, anchor);
    			append_dev(dt, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && t_value !== (t_value = ctx.line.key + "")) {
    				set_data_dev(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(dt);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block_1.name, type: "else", source: "(41:18) {:else}", ctx });
    	return block;
    }

    // (39:18) {#if line.key == ''}
    function create_if_block_3$2(ctx) {
    	var dt;

    	const block = {
    		c: function create() {
    			dt = element("dt");
    			dt.textContent = "Description";
    			attr_dev(dt, "class", "empty");
    			add_location(dt, file$f, 39, 22, 906);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, dt, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(dt);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_3$2.name, type: "if", source: "(39:18) {#if line.key == ''}", ctx });
    	return block;
    }

    // (55:18) {:else}
    function create_else_block$3(ctx) {
    	var dd, raw_value = ctx.line.value + "", dd_class_value;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			attr_dev(dd, "class", dd_class_value = cellSize( ctx.line.key + ctx.line.value ));
    			add_location(dd, file$f, 55, 22, 1490);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			dd.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && raw_value !== (raw_value = ctx.line.value + "")) {
    				dd.innerHTML = raw_value;
    			}

    			if ((changed.tab) && dd_class_value !== (dd_class_value = cellSize( ctx.line.key + ctx.line.value ))) {
    				attr_dev(dd, "class", dd_class_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(dd);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$3.name, type: "else", source: "(55:18) {:else}", ctx });
    	return block;
    }

    // (49:57) 
    function create_if_block_2$3(ctx) {
    	var div;

    	let each_value_1 = ctx.line.value;

    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(div, file$f, 49, 22, 1238);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},

    		p: function update(changed, ctx) {
    			if (changed.cellSize || changed.tab) {
    				each_value_1 = ctx.line.value;

    				let i;
    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value_1.length;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$3.name, type: "if", source: "(49:57) ", ctx });
    	return block;
    }

    // (45:18) {#if line.type && line.type == 'collection'}
    function create_if_block_1$7(ctx) {
    	var current;

    	var collectionlist = new List({
    		props: { list: ctx.line.value },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			collectionlist.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(collectionlist, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var collectionlist_changes = {};
    			if (changed.tab) collectionlist_changes.list = ctx.line.value;
    			collectionlist.$set(collectionlist_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(collectionlist.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(collectionlist.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(collectionlist, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$7.name, type: "if", source: "(45:18) {#if line.type && line.type == 'collection'}", ctx });
    	return block;
    }

    // (51:22) {#each line.value as bit}
    function create_each_block_1(ctx) {
    	var dd, raw_value = ctx.bit + "", dd_class_value;

    	const block = {
    		c: function create() {
    			dd = element("dd");
    			attr_dev(dd, "class", dd_class_value = cellSize( ctx.line.key + ctx.line.value ));
    			add_location(dd, file$f, 51, 26, 1318);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, dd, anchor);
    			dd.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && raw_value !== (raw_value = ctx.bit + "")) {
    				dd.innerHTML = raw_value;
    			}

    			if ((changed.tab) && dd_class_value !== (dd_class_value = cellSize( ctx.line.key + ctx.line.value ))) {
    				attr_dev(dd, "class", dd_class_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(dd);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block_1.name, type: "each", source: "(51:22) {#each line.value as bit}", ctx });
    	return block;
    }

    // (36:10) {#each tab.content as line}
    function create_each_block$8(ctx) {
    	var div, t0, show_if, current_block_type_index, if_block1, t1, current;

    	function select_block_type(changed, ctx) {
    		if (ctx.line.key == '') return create_if_block_3$2;
    		return create_else_block_1;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block0 = current_block_type(ctx);

    	var if_block_creators = [
    		create_if_block_1$7,
    		create_if_block_2$3,
    		create_else_block$3
    	];

    	var if_blocks = [];

    	function select_block_type_1(changed, ctx) {
    		if (ctx.line.type && ctx.line.type == 'collection') return 0;
    		if ((show_if == null) || changed.tab) show_if = !!(Array.isArray( ctx.line.value ));
    		if (show_if) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(null, ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t0 = space();
    			if_block1.c();
    			t1 = space();
    			add_location(div, file$f, 36, 14, 838);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			append_dev(div, t0);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t1);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block0) {
    				if_block0.p(changed, ctx);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);
    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block1 = if_blocks[current_block_type_index];
    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}
    				transition_in(if_block1, 1);
    				if_block1.m(div, t1);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if_block0.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$8.name, type: "each", source: "(36:10) {#each tab.content as line}", ctx });
    	return block;
    }

    function create_fragment$f(ctx) {
    	var section, h3, t0_value = ctx.tab.headline || 'Info' + "", t0, t1, section_class_value, current, dispose;

    	var if_block = (ctx.open) && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(h3, "class", "section--header");
    			add_location(h3, file$f, 32, 4, 600);
    			attr_dev(section, "class", section_class_value = "tab accordion " + ctx.tabClass( ctx.tab.headline ));
    			toggle_class(section, "open", ctx.open);
    			add_location(section, file$f, 31, 0, 526);
    			dispose = listen_dev(h3, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h3);
    			append_dev(h3, t0);
    			append_dev(section, t1);
    			if (if_block) if_block.m(section, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.tab) && t0_value !== (t0_value = ctx.tab.headline || 'Info' + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if (ctx.open) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(section, null);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}

    			if ((!current || changed.tab) && section_class_value !== (section_class_value = "tab accordion " + ctx.tabClass( ctx.tab.headline ))) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if ((changed.tab || changed.open)) {
    				toggle_class(section, "open", ctx.open);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			if (if_block) if_block.d();
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$f.name, type: "component", source: "", ctx });
    	return block;
    }

    function cellSize( str ){

        str = str.replace(/<[^>]+>/g, '');
        if ( str.length > 160 ){
            return 'long';
        }
        return '';

    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { tab, category, entity } = $$props;

      let open = false;

      function tabClass( cl = '' ){
          cl = cl.toLowerCase();
          if( cl != 'meta' || entity == 'file' ){
              $$invalidate('open', open = true);
          }
          return cl;
      }

    	const writable_props = ['tab', 'category', 'entity'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate('open', open = !open);

    	$$self.$set = $$props => {
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    		if ('entity' in $$props) $$invalidate('entity', entity = $$props.entity);
    	};

    	$$self.$capture_state = () => {
    		return { tab, category, entity, open };
    	};

    	$$self.$inject_state = $$props => {
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    		if ('entity' in $$props) $$invalidate('entity', entity = $$props.entity);
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	return {
    		tab,
    		category,
    		entity,
    		open,
    		tabClass,
    		click_handler
    	};
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, ["tab", "category", "entity"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Table", options, id: create_fragment$f.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.tab === undefined && !('tab' in props)) {
    			console.warn("<Table> was created without expected prop 'tab'");
    		}
    		if (ctx.category === undefined && !('category' in props)) {
    			console.warn("<Table> was created without expected prop 'category'");
    		}
    		if (ctx.entity === undefined && !('entity' in props)) {
    			console.warn("<Table> was created without expected prop 'entity'");
    		}
    	}

    	get tab() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get entity() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set entity(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tabs/text.svelte generated by Svelte v3.12.1 */

    const file$g = "src/components/tabs/text.svelte";

    function create_fragment$g(ctx) {
    	var section, h3, t0_value = ctx.tab.headline + "", t0, t1, div, raw_value = ctx.tab.content.html || '' + "";

    	const block = {
    		c: function create() {
    			section = element("section");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			attr_dev(h3, "class", "section--header");
    			add_location(h3, file$g, 9, 4, 99);
    			attr_dev(div, "class", "bodytext");
    			add_location(div, file$g, 11, 4, 154);
    			attr_dev(section, "class", "tab text");
    			add_location(section, file$g, 7, 0, 67);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h3);
    			append_dev(h3, t0);
    			append_dev(section, t1);
    			append_dev(section, div);
    			div.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.tab) && t0_value !== (t0_value = ctx.tab.headline + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.tab) && raw_value !== (raw_value = ctx.tab.content.html || '' + "")) {
    				div.innerHTML = raw_value;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$g.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { tab, category } = $$props;

    	const writable_props = ['tab', 'category'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    	};

    	$$self.$capture_state = () => {
    		return { tab, category };
    	};

    	$$self.$inject_state = $$props => {
    		if ('tab' in $$props) $$invalidate('tab', tab = $$props.tab);
    		if ('category' in $$props) $$invalidate('category', category = $$props.category);
    	};

    	return { tab, category };
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, ["tab", "category"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Text", options, id: create_fragment$g.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.tab === undefined && !('tab' in props)) {
    			console.warn("<Text> was created without expected prop 'tab'");
    		}
    		if (ctx.category === undefined && !('category' in props)) {
    			console.warn("<Text> was created without expected prop 'category'");
    		}
    	}

    	get tab() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tab(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get category() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set category(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/image.svelte generated by Svelte v3.12.1 */

    const file$h = "src/views/image.svelte";

    function create_fragment$h(ctx) {
    	var section, div, figure, raw_value = ctx.view.content.html + "", section_class_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			figure = element("figure");
    			add_location(figure, file$h, 11, 2, 164);
    			attr_dev(div, "class", "section--content");
    			add_location(div, file$h, 10, 1, 131);
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type);
    			add_location(section, file$h, 8, 0, 87);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, figure);
    			figure.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.view) && raw_value !== (raw_value = ctx.view.content.html + "")) {
    				figure.innerHTML = raw_value;
    			}

    			if ((changed.classname || changed.view) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type)) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$h.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { view, classname, transcript } = $$props;

    	const writable_props = ['view', 'classname', 'transcript'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    	};

    	$$self.$capture_state = () => {
    		return { view, classname, transcript };
    	};

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    	};

    	return { view, classname, transcript };
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, ["view", "classname", "transcript"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Image", options, id: create_fragment$h.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console.warn("<Image> was created without expected prop 'view'");
    		}
    		if (ctx.classname === undefined && !('classname' in props)) {
    			console.warn("<Image> was created without expected prop 'classname'");
    		}
    		if (ctx.transcript === undefined && !('transcript' in props)) {
    			console.warn("<Image> was created without expected prop 'transcript'");
    		}
    	}

    	get view() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transcript() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transcript(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/helpers/loadScript.svelte generated by Svelte v3.12.1 */
    const { console: console_1$2 } = globals;

    function create_fragment$i(ctx) {
    	const block = {
    		c: noop,

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$i.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	
        const dispatch = createEventDispatcher();

        /**
         * array of urls
         */
        let { dependencies } = $$props;
        let dependenciesLoaded = 0;

        let scripts = [];
        for (const src of dependencies) {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = false;
            script.onload = function() {

                dependenciesLoaded++;
                console.log( 'Load '+dependenciesLoaded+' of '+dependencies.length+': '+src);
                if( dependenciesLoaded < dependencies.length ){
                    return;
                }

                setTimeout(() => dispatch('loaded', {
                    loaded: true
                }), 1);
            };
            document.body.appendChild(script);
            scripts.push( script );
        }

        onDestroy(() => {
            for (const script of scripts) {
                console.log( 'Remove script '+script.src );
                script.remove();
            }
            scripts = [];
        });

    	const writable_props = ['dependencies'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$2.warn(`<LoadScript> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('dependencies' in $$props) $$invalidate('dependencies', dependencies = $$props.dependencies);
    	};

    	$$self.$capture_state = () => {
    		return { dependencies, dependenciesLoaded, scripts };
    	};

    	$$self.$inject_state = $$props => {
    		if ('dependencies' in $$props) $$invalidate('dependencies', dependencies = $$props.dependencies);
    		if ('dependenciesLoaded' in $$props) dependenciesLoaded = $$props.dependenciesLoaded;
    		if ('scripts' in $$props) scripts = $$props.scripts;
    	};

    	return { dependencies };
    }

    class LoadScript extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, ["dependencies"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "LoadScript", options, id: create_fragment$i.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.dependencies === undefined && !('dependencies' in props)) {
    			console_1$2.warn("<LoadScript> was created without expected prop 'dependencies'");
    		}
    	}

    	get dependencies() {
    		throw new Error("<LoadScript>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dependencies(value) {
    		throw new Error("<LoadScript>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/map.svelte generated by Svelte v3.12.1 */
    const { console: console_1$3 } = globals;

    const file$i = "src/views/map.svelte";

    // (211:2) {:else}
    function create_else_block$4(ctx) {
    	var span1, span0, t0_value = ctx.mapPositions.lat + "", t0, t1, t2_value = ctx.mapPositions.lon + "", t2, t3, t4_value = ctx.mapPositions.zoom + "", t4;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = text(", ");
    			t2 = text(t2_value);
    			t3 = text(", ");
    			t4 = text(t4_value);
    			attr_dev(span0, "class", "map-position");
    			add_location(span0, file$i, 212, 4, 4815);
    			attr_dev(span1, "class", "right");
    			add_location(span1, file$i, 211, 3, 4790);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span0, t0);
    			append_dev(span0, t1);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.mapPositions) && t0_value !== (t0_value = ctx.mapPositions.lat + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.mapPositions) && t2_value !== (t2_value = ctx.mapPositions.lon + "")) {
    				set_data_dev(t2, t2_value);
    			}

    			if ((changed.mapPositions) && t4_value !== (t4_value = ctx.mapPositions.zoom + "")) {
    				set_data_dev(t4, t4_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$4.name, type: "else", source: "(211:2) {:else}", ctx });
    	return block;
    }

    // (209:2) {#if loaded === false }
    function create_if_block$b(ctx) {
    	var span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Loading...";
    			attr_dev(span, "class", "message");
    			add_location(span, file$i, 209, 3, 4737);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$b.name, type: "if", source: "(209:2) {#if loaded === false }", ctx });
    	return block;
    }

    function create_fragment$j(ctx) {
    	var t0, link, t1, section, div1, div0, t2, div2, section_class_value, current;

    	var loadscript = new LoadScript({
    		props: { dependencies: ctx.dependencies },
    		$$inline: true
    	});
    	loadscript.$on("loaded", ctx.mapInit);

    	function select_block_type(changed, ctx) {
    		if (ctx.loaded === false) return create_if_block$b;
    		return create_else_block$4;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			loadscript.$$.fragment.c();
    			t0 = space();
    			link = element("link");
    			t1 = space();
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			t2 = space();
    			div2 = element("div");
    			if_block.c();
    			attr_dev(link, "href", "https://api.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.css");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file$i, 198, 1, 4398);
    			attr_dev(div0, "id", "map");
    			set_style(div0, "width", "100%");
    			set_style(div0, "height", "100%");
    			attr_dev(div0, "class", "svelte-1m58pdr");
    			add_location(div0, file$i, 204, 2, 4579);
    			attr_dev(div1, "class", "section--content");
    			add_location(div1, file$i, 203, 1, 4546);
    			attr_dev(div2, "class", "section--controls bar controls");
    			attr_dev(div2, "id", "map-controls");
    			add_location(div2, file$i, 207, 1, 4645);
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type);
    			add_location(section, file$i, 201, 0, 4502);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(loadscript, target, anchor);
    			insert_dev(target, t0, anchor);
    			append_dev(document.head, link);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(section, t2);
    			append_dev(section, div2);
    			if_block.m(div2, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}

    			if ((!current || changed.classname || changed.view) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type)) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadscript.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(loadscript.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(loadscript, detaching);

    			if (detaching) {
    				detach_dev(t0);
    			}

    			detach_dev(link);

    			if (detaching) {
    				detach_dev(t1);
    				detach_dev(section);
    			}

    			if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$j.name, type: "component", source: "", ctx });
    	return block;
    }

    function round( f, d = 2 ){
    	// round coords
    	return f.toFixed(d);
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const dependencies = [
    		"https://api.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.js"
    	];

    	let { view, classname } = $$props;

    	/*
    	* mapbox api
    	* https://docs.mapbox.com/mapbox-gl-js/api/
    	* someone mixed up lat <-> lon, i dont know, just try, error, fix
    	*/

    	var map;

    	let mapPositions = {
    		lat: 25,
    		lon: 30,
    		zoom: 1
    	};

    	const mapstyles = {
    		dark: 'mapbox://styles/moriwaan/cjzqsxone04y21ctdxp1dgogb',
    		light: 'mapbox://styles/moriwaan/ck3njz1ds2lgm1cqp2poywa3i'
    	};

    	let loaded = false;

    	let popups = {
    		visible: false,
    		threshold: 16,
    		elements: [],
    		show: function(){

    			console.log('show()');

    			let els = this.elements;

    			view.content.forEach(function(marker) {

    				let item = marker.properties;
    				let html = '<li class="card">'+
    					'<a onclick="navi(event)" href="'+item.url+'" data-template="'+item.template+'">';
    						if(item.thumbnail){
    							html +='<figure>' + item.thumbnail + '</figure>';
    						}
    						html += '<div class="title">';
    							html += '<span class="count">' + ( item.count || 1 ) + '</span>';
    							html += '<h4>'+item.title+'</h4>';
    						html += '</div>';
    					html += '</a>';
    				html += '</li>';

    				var popup = new mapboxgl.Popup({ closeOnClick: false, closeButton: false, anchor: 'bottom-left' })
    					.setLngLat( marker.geometry.coordinates )
    					.setHTML( html )
    					.addTo( map );
    				els.push( popup );

    			});
    			this.visible = true;

    		},
    		hide: function(){
    			for (const popup of this.elements) {
    				popup.remove();
    			}
    			this.elements = [];
    			this.visible = false;
    		}
    	};

    	function mapInit(){

    		console.log('mapInit');

    		mapboxgl.accessToken = 'pk.eyJ1IjoibW9yaXdhYW4iLCJhIjoiY2l4cnIxNTFvMDAzZjJ3cGJ6MmpiY2ZmciJ9.KnmjmhWCBzMm-D30JdnnXg';

    		map = new mapboxgl.Map({
    			container: 'map',
    			style: mapstyles.light,
    			center: [ mapPositions.lon, mapPositions.lat ],
    			zoom: mapPositions.zoom
    		});

    		map.on('load', function() {

    			map.addSource("buildings", {
    				"type": "geojson",
    				"data": {
    					"type": "FeatureCollection",
    					"features": view.content
    				},
    				cluster: true,
    				clusterMaxZoom: 7, // Max zoom to cluster points on
    				clusterRadius: 24 // Radius of each cluster when clustering points
    			});

    			map.addLayer({
    				"id": "dots",
    				"type": "circle",
    				"source": "buildings",
    				"filter": ["==", "$type", "Point"],
    				"paint": {
    					'circle-radius': {
    						'base': 5,
    						// adjust radius to zoom level [[zoom, radius],...]
    						'stops': [ [2, 18], [6, 12], [8, 5], [10, 4], [13, 4], [16, 8], [22, 180] ]
    					},
    					'circle-color': '#00f'
    				},
    			});

    			$$invalidate('loaded', loaded = true);

    		});

    		map.on('move', function (e) {
    			var center = map.getCenter();
    			$$invalidate('mapPositions', mapPositions.lat = round( center.lat ), mapPositions);
    			$$invalidate('mapPositions', mapPositions.lon = round( center.lng ), mapPositions);
    		});

    		map.on('zoom', function (e) {
    			var zoom = map.getZoom();
    			$$invalidate('mapPositions', mapPositions.zoom = round( zoom, 0 ), mapPositions);

    			if( zoom > popups.threshold && popups.visible === false ){
    				popups.show();
    			} else if( zoom < popups.threshold && popups.visible === true ){
    				popups.hide();
    			}

    		});

    		map.on('mouseenter', 'dots', function () {
    			map.getCanvas().style.cursor = 'pointer';
    		});
    		map.on('mouseleave', 'dots', function () {
    			map.getCanvas().style.cursor = '';
    		});

    		map.on('click', 'dots', function (e) {
    			var features = map.queryRenderedFeatures(e.point, { layers: ['dots'] });
    			console.log( features[0] );
    			var cluster_id = features[0].properties.cluster_id;
    			if( cluster_id !== undefined ){
    				map.getSource('buildings').getClusterExpansionZoom(cluster_id, function (err, zoom) {
    						if (err){ return; }
    					map.easeTo({
    						center: features[0].geometry.coordinates,
    						zoom: zoom
    					});
    				});
    			} else {
    				let zoomTo = map.getZoom() + 3;
    				if( zoomTo > 10 ){
    					zoomTo = popups.threshold + 0.2;
    				}
    				map.easeTo({
    					center: features[0].geometry.coordinates,
    					zoom: zoomTo
    				});
    			}
    		});

    	}
    	const writable_props = ['view', 'classname'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$3.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    	};

    	$$self.$capture_state = () => {
    		return { view, classname, map, mapPositions, loaded, popups };
    	};

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('map' in $$props) map = $$props.map;
    		if ('mapPositions' in $$props) $$invalidate('mapPositions', mapPositions = $$props.mapPositions);
    		if ('loaded' in $$props) $$invalidate('loaded', loaded = $$props.loaded);
    		if ('popups' in $$props) popups = $$props.popups;
    	};

    	return {
    		dependencies,
    		view,
    		classname,
    		mapPositions,
    		loaded,
    		mapInit
    	};
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, ["view", "classname"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Map", options, id: create_fragment$j.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console_1$3.warn("<Map> was created without expected prop 'view'");
    		}
    		if (ctx.classname === undefined && !('classname' in props)) {
    			console_1$3.warn("<Map> was created without expected prop 'classname'");
    		}
    	}

    	get view() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<Map>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<Map>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/3d.svelte generated by Svelte v3.12.1 */
    const { console: console_1$4 } = globals;

    const file$j = "src/views/3d.svelte";

    // (158:2) {:else}
    function create_else_block$5(ctx) {
    	var span0, t0, span2, span1, t1_value = ctx.cameraRotation.x + "", t1, t2, t3_value = ctx.cameraRotation.y + "", t3, t4, t5_value = ctx.cameraRotation.z + "", t5;

    	function select_block_type_1(changed, ctx) {
    		if (ctx.autoRotate === true) return create_if_block_1$8;
    		return create_else_block_1$1;
    	}

    	var current_block_type = select_block_type_1(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if_block.c();
    			t0 = space();
    			span2 = element("span");
    			span1 = element("span");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(", ");
    			t5 = text(t5_value);
    			attr_dev(span0, "class", "left");
    			add_location(span0, file$j, 158, 3, 3961);
    			attr_dev(span1, "class", "3d-rotation");
    			add_location(span1, file$j, 166, 4, 4211);
    			attr_dev(span2, "class", "right");
    			add_location(span2, file$j, 165, 3, 4186);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			if_block.m(span0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span2, anchor);
    			append_dev(span2, span1);
    			append_dev(span1, t1);
    			append_dev(span1, t2);
    			append_dev(span1, t3);
    			append_dev(span1, t4);
    			append_dev(span1, t5);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type !== (current_block_type = select_block_type_1(changed, ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(span0, null);
    				}
    			}

    			if ((changed.cameraRotation) && t1_value !== (t1_value = ctx.cameraRotation.x + "")) {
    				set_data_dev(t1, t1_value);
    			}

    			if ((changed.cameraRotation) && t3_value !== (t3_value = ctx.cameraRotation.y + "")) {
    				set_data_dev(t3, t3_value);
    			}

    			if ((changed.cameraRotation) && t5_value !== (t5_value = ctx.cameraRotation.z + "")) {
    				set_data_dev(t5, t5_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span0);
    			}

    			if_block.d();

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(span2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$5.name, type: "else", source: "(158:2) {:else}", ctx });
    	return block;
    }

    // (156:2) {#if loaded == false }
    function create_if_block$c(ctx) {
    	var span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Loading ...";
    			attr_dev(span, "class", "message");
    			add_location(span, file$j, 156, 3, 3907);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$c.name, type: "if", source: "(156:2) {#if loaded == false }", ctx });
    	return block;
    }

    // (162:4) {:else}
    function create_else_block_1$1(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Rotate";
    			attr_dev(button, "class", "3d-play");
    			add_location(button, file$j, 162, 5, 4097);
    			dispose = listen_dev(button, "click", ctx.startRotation);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block_1$1.name, type: "else", source: "(162:4) {:else}", ctx });
    	return block;
    }

    // (160:4) {#if autoRotate === true}
    function create_if_block_1$8(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Pause";
    			attr_dev(button, "class", "3d-pause");
    			add_location(button, file$j, 160, 5, 4016);
    			dispose = listen_dev(button, "click", ctx.stopRotation);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$8.name, type: "if", source: "(160:4) {#if autoRotate === true}", ctx });
    	return block;
    }

    function create_fragment$k(ctx) {
    	var t0, section, div1, div0, t1, div2, section_class_value, current;

    	var loadscript = new LoadScript({
    		props: { dependencies: ctx.dependencies },
    		$$inline: true
    	});
    	loadscript.$on("loaded", ctx.threeInit);

    	function select_block_type(changed, ctx) {
    		if (ctx.loaded == false) return create_if_block$c;
    		return create_else_block$5;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			loadscript.$$.fragment.c();
    			t0 = space();
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div2 = element("div");
    			if_block.c();
    			attr_dev(div0, "id", "view-3d");
    			add_location(div0, file$j, 151, 2, 3777);
    			attr_dev(div1, "class", "section--content");
    			add_location(div1, file$j, 150, 1, 3744);
    			attr_dev(div2, "class", "bar controls section--controls");
    			attr_dev(div2, "id", "view-3d-controls");
    			add_location(div2, file$j, 154, 1, 3812);
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type);
    			add_location(section, file$j, 148, 0, 3700);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(loadscript, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(section, t1);
    			append_dev(section, div2);
    			if_block.m(div2, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}

    			if ((!current || changed.classname || changed.view) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type)) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadscript.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(loadscript.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(loadscript, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(section);
    			}

    			if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$k.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const dependencies = [
    		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/three.min.js",
    		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/inflate.min.js",
    		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/FBXLoader.js",
    		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/OrbitControls.js",
    	];

    	let { view, classname } = $$props;

    	var loaded = false;

    	var cameraRotation = {
    		x: 0,
    		y: 0,
    		z: 0
    	};

    	var autoRotate = true;

    	/*
    	* this code should best be outsourced, babelized and embedded here
    	*/

    	var windowHalfX = window.innerWidth / 2;
    	var windowHalfY = window.innerHeight / 2;

    	var camera, scene, renderer, controls, object;

    	var container, containerWidth, containerHeight;

    	function threeInit(){

    		container = document.getElementById( 'view-3d' );

    		containerWidth = container.parentElement.offsetWidth;
    		containerHeight = container.parentElement.offsetHeight;

    		init();
    		animate();

    	}

    	function init() {

    		// console.log('init');

    		// camera
    		camera = new THREE.PerspectiveCamera( 45, containerWidth / containerHeight, 1, 10000 );
    		camera.position.set( 50, 50, 50 );

    		// scene
    		scene = new THREE.Scene();

    		// 0.4
    		var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
    		scene.add( ambientLight );

    		// 0.8
    		var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    		camera.add( pointLight );
    		scene.add( camera );


    		// model
    		var loader = new THREE.FBXLoader();
    		loader.load( view.content.url, function ( object ) {

    			$$invalidate('loaded', loaded = true);
    			scene.add( object );
    			controls.autoRotate = true;

    		}, undefined, function ( e ) {
    			console.error( e );
    		});

    		// renderer
    		renderer = new THREE.WebGLRenderer();
    		renderer.setPixelRatio( window.devicePixelRatio );
    		renderer.setSize( containerWidth, containerHeight );

    		container.appendChild( renderer.domElement );

    		// controls
    		controls = new THREE.OrbitControls( camera, renderer.domElement );
    		controls.target.set( 0, 0, 0 );
    		controls.autoRotate = false;
    		controls.update();

    		// add guidelines
    		var materialBlue = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    		var geometryGuides = new THREE.Geometry();
    		geometryGuides.vertices.push( new THREE.Vector3( 20, 0, 0) );
    		geometryGuides.vertices.push( new THREE.Vector3( 0, 0, 0) );
    		geometryGuides.vertices.push( new THREE.Vector3( 0, 20, 0) );
    		geometryGuides.vertices.push( new THREE.Vector3( 0, 0, 0) );
    		geometryGuides.vertices.push( new THREE.Vector3( 0, 0, 20) );
    		var line = new THREE.Line( geometryGuides, materialBlue );
    		scene.add( line );

    		// events
    		window.addEventListener( 'resize', onWindowResize, false );

    	}
    	/**
    	 * interactions
    	 */
    	function onWindowResize() {

    		containerWidth = container.parentElement.offsetWidth;
    		containerHeight = container.parentElement.offsetHeight;

    		camera.aspect = containerWidth / containerHeight;
    		camera.updateProjectionMatrix();

    		renderer.setSize( containerWidth, containerHeight );

    	}
    	function animate() {

    		requestAnimationFrame( animate );

    		controls.update();
    		$$invalidate('cameraRotation', cameraRotation.x = Math.round( camera.position.x ), cameraRotation);
    		$$invalidate('cameraRotation', cameraRotation.y = Math.round( camera.position.y ), cameraRotation);
    		$$invalidate('cameraRotation', cameraRotation.z = Math.round( camera.position.z ), cameraRotation);

    		renderer.render( scene, camera );

    	}
    	function startRotation(){
    		console.log('start 3d rotation');
    		$$invalidate('autoRotate', autoRotate = true);
    		controls.autoRotate = true;
    	}
    	function stopRotation(){
    		console.log('stop 3d rotation');
    		$$invalidate('autoRotate', autoRotate = false);
    		controls.autoRotate = false;
    	}

    	const writable_props = ['view', 'classname'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$4.warn(`<_3d> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    	};

    	$$self.$capture_state = () => {
    		return { view, classname, loaded, cameraRotation, autoRotate, windowHalfX, windowHalfY, camera, scene, renderer, controls, object, container, containerWidth, containerHeight };
    	};

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('loaded' in $$props) $$invalidate('loaded', loaded = $$props.loaded);
    		if ('cameraRotation' in $$props) $$invalidate('cameraRotation', cameraRotation = $$props.cameraRotation);
    		if ('autoRotate' in $$props) $$invalidate('autoRotate', autoRotate = $$props.autoRotate);
    		if ('windowHalfX' in $$props) windowHalfX = $$props.windowHalfX;
    		if ('windowHalfY' in $$props) windowHalfY = $$props.windowHalfY;
    		if ('camera' in $$props) camera = $$props.camera;
    		if ('scene' in $$props) scene = $$props.scene;
    		if ('renderer' in $$props) renderer = $$props.renderer;
    		if ('controls' in $$props) controls = $$props.controls;
    		if ('object' in $$props) object = $$props.object;
    		if ('container' in $$props) container = $$props.container;
    		if ('containerWidth' in $$props) containerWidth = $$props.containerWidth;
    		if ('containerHeight' in $$props) containerHeight = $$props.containerHeight;
    	};

    	return {
    		dependencies,
    		view,
    		classname,
    		loaded,
    		cameraRotation,
    		autoRotate,
    		threeInit,
    		startRotation,
    		stopRotation
    	};
    }

    class _3d extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, ["view", "classname"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "_3d", options, id: create_fragment$k.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console_1$4.warn("<_3d> was created without expected prop 'view'");
    		}
    		if (ctx.classname === undefined && !('classname' in props)) {
    			console_1$4.warn("<_3d> was created without expected prop 'classname'");
    		}
    	}

    	get view() {
    		throw new Error("<_3d>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<_3d>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<_3d>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<_3d>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/panorama.svelte generated by Svelte v3.12.1 */
    const { console: console_1$5 } = globals;

    const file$k = "src/views/panorama.svelte";

    // (217:2) {:else}
    function create_else_block$6(ctx) {
    	var span0, t0, span2, span1, t1_value = ctx.cameraRotation.lat + "", t1, t2, t3_value = ctx.cameraRotation.lon + "", t3;

    	function select_block_type_1(changed, ctx) {
    		if (ctx.autoRotate === true) return create_if_block_1$9;
    		return create_else_block_1$2;
    	}

    	var current_block_type = select_block_type_1(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			if_block.c();
    			t0 = space();
    			span2 = element("span");
    			span1 = element("span");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			attr_dev(span0, "class", "left");
    			add_location(span0, file$k, 217, 3, 4707);
    			attr_dev(span1, "class", "3d-rotation");
    			add_location(span1, file$k, 225, 4, 4958);
    			attr_dev(span2, "class", "right");
    			add_location(span2, file$k, 224, 3, 4933);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			if_block.m(span0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span2, anchor);
    			append_dev(span2, span1);
    			append_dev(span1, t1);
    			append_dev(span1, t2);
    			append_dev(span1, t3);
    		},

    		p: function update_1(changed, ctx) {
    			if (current_block_type !== (current_block_type = select_block_type_1(changed, ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(span0, null);
    				}
    			}

    			if ((changed.cameraRotation) && t1_value !== (t1_value = ctx.cameraRotation.lat + "")) {
    				set_data_dev(t1, t1_value);
    			}

    			if ((changed.cameraRotation) && t3_value !== (t3_value = ctx.cameraRotation.lon + "")) {
    				set_data_dev(t3, t3_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span0);
    			}

    			if_block.d();

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(span2);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$6.name, type: "else", source: "(217:2) {:else}", ctx });
    	return block;
    }

    // (215:2) {#if loaded == false }
    function create_if_block$d(ctx) {
    	var span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Loading ...";
    			attr_dev(span, "class", "message");
    			add_location(span, file$k, 215, 3, 4653);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$d.name, type: "if", source: "(215:2) {#if loaded == false }", ctx });
    	return block;
    }

    // (221:4) {:else}
    function create_else_block_1$2(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Rotate";
    			attr_dev(button, "class", "3d-play");
    			add_location(button, file$k, 221, 5, 4844);
    			dispose = listen_dev(button, "click", ctx.startRotation);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block_1$2.name, type: "else", source: "(221:4) {:else}", ctx });
    	return block;
    }

    // (219:4) {#if autoRotate === true }
    function create_if_block_1$9(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Pause";
    			attr_dev(button, "class", "3d-pause");
    			add_location(button, file$k, 219, 5, 4763);
    			dispose = listen_dev(button, "click", ctx.stopRotation);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$9.name, type: "if", source: "(219:4) {#if autoRotate === true }", ctx });
    	return block;
    }

    function create_fragment$l(ctx) {
    	var t0, section, div1, div0, t1, div2, section_class_value, current;

    	var loadscript = new LoadScript({
    		props: { dependencies: ctx.dependencies },
    		$$inline: true
    	});
    	loadscript.$on("loaded", ctx.threeInit);

    	function select_block_type(changed, ctx) {
    		if (ctx.loaded == false) return create_if_block$d;
    		return create_else_block$6;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			loadscript.$$.fragment.c();
    			t0 = space();
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div2 = element("div");
    			if_block.c();
    			attr_dev(div0, "id", "view-3d");
    			add_location(div0, file$k, 211, 2, 4524);
    			attr_dev(div1, "class", "section--content");
    			add_location(div1, file$k, 210, 1, 4491);
    			attr_dev(div2, "class", "bar controls section--controls");
    			attr_dev(div2, "id", "view-3d-controls");
    			add_location(div2, file$k, 213, 1, 4558);
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type);
    			add_location(section, file$k, 208, 0, 4447);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(loadscript, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(section, t1);
    			append_dev(section, div2);
    			if_block.m(div2, null);
    			current = true;
    		},

    		p: function update_1(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			}

    			if ((!current || changed.classname || changed.view) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type)) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadscript.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(loadscript.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(loadscript, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(section);
    			}

    			if_block.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$l.name, type: "component", source: "", ctx });
    	return block;
    }

    var boxSize = 180;

    function instance$l($$self, $$props, $$invalidate) {
    	const dependencies = [
    		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/three.min.js",
    		"https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/js/OrbitControls.js",
    	];

    	let { view, classname, transcript } = $$props;

    	/*
    	* this code should best be outsourced, babelized and embedded here
    	*/

    	// console.log( view.content.url )

    	var windowHalfX = window.innerWidth / 2;
    	var windowHalfY = window.innerHeight / 2;

    	var camera, scene, renderer, controls, object;

    	var container, containerWidth, containerHeight;

    	var autoRotate = true;

    	var loaded = false;

    	var isUserInteracting = false;
    	var onPointerDownPointerX = 0;
    	var onPointerDownPointerY = 0;
    	var lon = 180;
    	var onPointerDownLon = 180;
    	var lat = 0;
    	var onPointerDownLat = 0;
    	var phi = 0;
    	var theta = 0;

    	var cameraRotation = {
    		lat: 0,
    		lon: 0
    	};

    	function threeInit() {

    		container = document.getElementById( 'view-3d' );

    		containerWidth = container.parentElement.offsetWidth;
    		containerHeight = container.parentElement.offsetHeight;

    		init();
    		animate();

    	}

    	function init() {

    		// camera
    		camera = new THREE.PerspectiveCamera( 100, containerWidth / containerHeight, 1, 1100 );
    		// camera.position.set( 0, 0, 0 );
    		camera.target = new THREE.Vector3( 20, 0, 0 );

    		// scene
    		scene = new THREE.Scene();

    		// geo
    		var geometry = new THREE.SphereGeometry( boxSize, 60, 40 );
    		geometry.scale( - 1, 1, 1 );

    		// texture
    		var material = new THREE.MeshBasicMaterial( {
    			map: new THREE.TextureLoader().load(
    				view.content.url,
    				function(){
    					$$invalidate('loaded', loaded = true);
    				},
    				undefined,
    				function(err){
    					console.log('panorama loading error');
    				} )
    		} );

    		object = new THREE.Mesh( geometry, material );

    		scene.add( object );

    		// renderer
    		renderer = new THREE.WebGLRenderer();
    		renderer.setPixelRatio( window.devicePixelRatio );
    		renderer.setSize( containerWidth, containerHeight );

    		container.appendChild( renderer.domElement );

    		// events
    		window.addEventListener( 'resize', onWindowResize, false );

    		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    		// document.addEventListener( 'wheel', onDocumentMouseWheel, false );

    	}

    	function onWindowResize() {

    		containerWidth = container.parentElement.offsetWidth;
    		containerHeight = container.parentElement.offsetHeight;

    		// windowHalfX = window.innerWidth / 2;
    		// windowHalfY = window.innerHeight / 2;

    		camera.aspect = containerWidth / containerHeight;
    		camera.updateProjectionMatrix();

    		renderer.setSize( containerWidth, containerHeight );

    	}

    	function animate() {

    		requestAnimationFrame( animate );
    		update();

    	}

    	function onDocumentMouseDown( event ) {

    		event.preventDefault();

    		isUserInteracting = true;

    		onPointerDownPointerX = event.clientX;
    		onPointerDownPointerY = event.clientY;

    		onPointerDownLon = lon;
    		onPointerDownLat = lat;

    	}

    	function onDocumentMouseMove( event ) {

    		if ( isUserInteracting === true ) {

    			lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
    			lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

    		}

    	}

    	function onDocumentMouseUp( event ) {

    		isUserInteracting = false;

    	}
    	/*
    	function onDocumentMouseWheel( event ) {

    		camera.fov += event.deltaY * 0.05;
    		camera.updateProjectionMatrix();

    	}
    	*/
    	function update() {

    		if ( isUserInteracting === false && autoRotate === true ) {

    			lon += 0.09;

    		}

    		lat = Math.max( - 85, Math.min( 85, lat ) );
    		phi = THREE.Math.degToRad( 90 - lat );
    		theta = THREE.Math.degToRad( lon );

    		camera.target.x = boxSize * Math.sin( phi ) * Math.cos( theta );
    		camera.target.y = boxSize * Math.cos( phi );
    		camera.target.z = boxSize * Math.sin( phi ) * Math.sin( theta );

    		camera.lookAt( camera.target );

    		$$invalidate('cameraRotation', cameraRotation.lat = Math.round( lat ), cameraRotation);
    		$$invalidate('cameraRotation', cameraRotation.lon = Math.round( ( lon%360 )-180 ), cameraRotation);

    		/*
    		// distortion
    		camera.position.copy( camera.target ).negate();
    		*/

    		renderer.render( scene, camera );

    	}

    	function startRotation(){
    		$$invalidate('autoRotate', autoRotate = true);
    	}
    	function stopRotation(){
    		$$invalidate('autoRotate', autoRotate = false);
    	}

    	const writable_props = ['view', 'classname', 'transcript'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$5.warn(`<Panorama> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    	};

    	$$self.$capture_state = () => {
    		return { view, classname, transcript, windowHalfX, windowHalfY, camera, scene, renderer, controls, object, container, containerWidth, containerHeight, autoRotate, loaded, isUserInteracting, onPointerDownPointerX, onPointerDownPointerY, lon, onPointerDownLon, lat, onPointerDownLat, phi, theta, boxSize, cameraRotation };
    	};

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('transcript' in $$props) $$invalidate('transcript', transcript = $$props.transcript);
    		if ('windowHalfX' in $$props) windowHalfX = $$props.windowHalfX;
    		if ('windowHalfY' in $$props) windowHalfY = $$props.windowHalfY;
    		if ('camera' in $$props) camera = $$props.camera;
    		if ('scene' in $$props) scene = $$props.scene;
    		if ('renderer' in $$props) renderer = $$props.renderer;
    		if ('controls' in $$props) controls = $$props.controls;
    		if ('object' in $$props) object = $$props.object;
    		if ('container' in $$props) container = $$props.container;
    		if ('containerWidth' in $$props) containerWidth = $$props.containerWidth;
    		if ('containerHeight' in $$props) containerHeight = $$props.containerHeight;
    		if ('autoRotate' in $$props) $$invalidate('autoRotate', autoRotate = $$props.autoRotate);
    		if ('loaded' in $$props) $$invalidate('loaded', loaded = $$props.loaded);
    		if ('isUserInteracting' in $$props) isUserInteracting = $$props.isUserInteracting;
    		if ('onPointerDownPointerX' in $$props) onPointerDownPointerX = $$props.onPointerDownPointerX;
    		if ('onPointerDownPointerY' in $$props) onPointerDownPointerY = $$props.onPointerDownPointerY;
    		if ('lon' in $$props) lon = $$props.lon;
    		if ('onPointerDownLon' in $$props) onPointerDownLon = $$props.onPointerDownLon;
    		if ('lat' in $$props) lat = $$props.lat;
    		if ('onPointerDownLat' in $$props) onPointerDownLat = $$props.onPointerDownLat;
    		if ('phi' in $$props) phi = $$props.phi;
    		if ('theta' in $$props) theta = $$props.theta;
    		if ('boxSize' in $$props) boxSize = $$props.boxSize;
    		if ('cameraRotation' in $$props) $$invalidate('cameraRotation', cameraRotation = $$props.cameraRotation);
    	};

    	return {
    		dependencies,
    		view,
    		classname,
    		transcript,
    		autoRotate,
    		loaded,
    		cameraRotation,
    		threeInit,
    		startRotation,
    		stopRotation
    	};
    }

    class Panorama extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, ["view", "classname", "transcript"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Panorama", options, id: create_fragment$l.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console_1$5.warn("<Panorama> was created without expected prop 'view'");
    		}
    		if (ctx.classname === undefined && !('classname' in props)) {
    			console_1$5.warn("<Panorama> was created without expected prop 'classname'");
    		}
    		if (ctx.transcript === undefined && !('transcript' in props)) {
    			console_1$5.warn("<Panorama> was created without expected prop 'transcript'");
    		}
    	}

    	get view() {
    		throw new Error("<Panorama>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<Panorama>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<Panorama>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<Panorama>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transcript() {
    		throw new Error("<Panorama>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transcript(value) {
    		throw new Error("<Panorama>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/templates/entity.svelte generated by Svelte v3.12.1 */

    const file$l = "src/templates/entity.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.tab = list[i];
    	return child_ctx;
    }

    // (69:2) {#if page.loading}
    function create_if_block_2$4(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "is-loading");
    			add_location(div, file$l, 68, 20, 1481);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$4.name, type: "if", source: "(69:2) {#if page.loading}", ctx });
    	return block;
    }

    // (71:2) {#if page.content}
    function create_if_block_1$a(ctx) {
    	var main_1, div1, div0, main_1_class_value, current, dispose;

    	let each_value = ctx.page.content;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main_1 = element("main");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(div0, "class", "tabs");
    			add_location(div0, file$l, 75, 8, 1684);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$l, 74, 6, 1654);
    			attr_dev(main_1, "class", main_1_class_value = "panel col-sm-" + contentWidth(ctx.page.entity));
    			add_location(main_1, file$l, 72, 4, 1544);
    			dispose = listen_dev(main_1, "scroll", ctx.scrolling, { passive: true });
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, main_1, anchor);
    			append_dev(main_1, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			ctx.main_1_binding(main_1);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.tabs || changed.page) {
    				each_value = ctx.page.content;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}

    			if ((!current || changed.page) && main_1_class_value !== (main_1_class_value = "panel col-sm-" + contentWidth(ctx.page.entity))) {
    				attr_dev(main_1, "class", main_1_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(main_1);
    			}

    			destroy_each(each_blocks, detaching);

    			ctx.main_1_binding(null);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$a.name, type: "if", source: "(71:2) {#if page.content}", ctx });
    	return block;
    }

    // (77:10) {#each page.content as tab}
    function create_each_block$9(ctx) {
    	var switch_instance_anchor, current;

    	var switch_value = ctx.tabs[ ctx.tab.type ];

    	function switch_props(ctx) {
    		return {
    			props: {
    			tab: ctx.tab,
    			category: ctx.page.category,
    			entity: ctx.page.entity
    		},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.page) switch_instance_changes.tab = ctx.tab;
    			if (changed.page) switch_instance_changes.category = ctx.page.category;
    			if (changed.page) switch_instance_changes.entity = ctx.page.entity;

    			if (switch_value !== (switch_value = ctx.tabs[ ctx.tab.type ])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(switch_instance_anchor);
    			}

    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$9.name, type: "each", source: "(77:10) {#each page.content as tab}", ctx });
    	return block;
    }

    // (88:2) {#if page.view}
    function create_if_block$e(ctx) {
    	var switch_instance_anchor, current;

    	var switch_value = ctx.views[ ctx.page.view.type ];

    	function switch_props(ctx) {
    		return {
    			props: {
    			view: ctx.page.view,
    			classname: "presentation panel col-sm-" + (12 - contentWidth(ctx.page.entity)),
    			transcript: ctx.page.transcript || false
    		},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.page) switch_instance_changes.view = ctx.page.view;
    			if (changed.page) switch_instance_changes.classname = "presentation panel col-sm-" + (12 - contentWidth(ctx.page.entity));
    			if (changed.page) switch_instance_changes.transcript = ctx.page.transcript || false;

    			if (switch_value !== (switch_value = ctx.views[ ctx.page.view.type ])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(switch_instance_anchor);
    			}

    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$e.name, type: "if", source: "(88:2) {#if page.view}", ctx });
    	return block;
    }

    function create_fragment$m(ctx) {
    	var div, t0, t1, current;

    	var if_block0 = (ctx.page.loading) && create_if_block_2$4(ctx);

    	var if_block1 = (ctx.page.content) && create_if_block_1$a(ctx);

    	var if_block2 = (ctx.page.view) && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "grid panels");
    			add_location(div, file$l, 66, 0, 1434);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.page.loading) {
    				if (!if_block0) {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.page.content) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_1$a(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();
    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});
    				check_outros();
    			}

    			if (ctx.page.view) {
    				if (if_block2) {
    					if_block2.p(changed, ctx);
    					transition_in(if_block2, 1);
    				} else {
    					if_block2 = create_if_block$e(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();
    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$m.name, type: "component", source: "", ctx });
    	return block;
    }

    function contentWidth( type ){
    	if( type == 'file' ){
    		return 3;
    	}
    	return 6;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	
    	let tabs = {
    		header: Header,
    		collection: Collection$1,
    		table: Table,
    		text: Text
      };
    	let views = {
    		'collection': Collection,
    		'image': Image,
    		'video': Video,
    		'audio': Audio,
    		'map': Map$1,
    		'3d': _3d,
    		'panorama': Panorama
    	};

    	let { page } = $$props;

      let main;
    	var isScrolled = false;
    	var isScrolledPrev = false;
    	function scrolling(){
    		if( main.scrollTop > 100 ){
    			isScrolled = true;
    		} else {
    			isScrolled = false;
    		}
    		if( isScrolled === isScrolledPrev ){
    			return;
    		}
    		isScrolledPrev = isScrolled;

    		if( isScrolledPrev === true ){
    			document.body.classList.add('scrolled');
    		} else {
    			document.body.classList.remove('scrolled');
    		}
    	}

    	const writable_props = ['page'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Entity> was created with unknown prop '${key}'`);
    	});

    	function main_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('main', main = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    	};

    	$$self.$capture_state = () => {
    		return { tabs, views, page, main, isScrolled, isScrolledPrev };
    	};

    	$$self.$inject_state = $$props => {
    		if ('tabs' in $$props) $$invalidate('tabs', tabs = $$props.tabs);
    		if ('views' in $$props) $$invalidate('views', views = $$props.views);
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    		if ('main' in $$props) $$invalidate('main', main = $$props.main);
    		if ('isScrolled' in $$props) isScrolled = $$props.isScrolled;
    		if ('isScrolledPrev' in $$props) isScrolledPrev = $$props.isScrolledPrev;
    	};

    	return {
    		tabs,
    		views,
    		page,
    		main,
    		scrolling,
    		main_1_binding
    	};
    }

    class Entity extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, ["page"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Entity", options, id: create_fragment$m.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.page === undefined && !('page' in props)) {
    			console.warn("<Entity> was created without expected prop 'page'");
    		}
    	}

    	get page() {
    		throw new Error("<Entity>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Entity>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/liebling-house/pagination.svelte generated by Svelte v3.12.1 */

    const file$m = "src/liebling-house/pagination.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (10:4) {#if pagination.prev }
    function create_if_block_2$5(ctx) {
    	var current;

    	var link = new Link({
    		props: {
    		target: ctx.pagination.prev,
    		replace: true,
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			link.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.pagination) link_changes.target = ctx.pagination.prev;
    			if (changed.$$scope) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$5.name, type: "if", source: "(10:4) {#if pagination.prev }", ctx });
    	return block;
    }

    // (11:6) <Link target={pagination.prev} replace={true}>
    function create_default_slot_3(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("←");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_3.name, type: "slot", source: "(11:6) <Link target={pagination.prev} replace={true}>", ctx });
    	return block;
    }

    // (14:4) {#if pagination.siblings}
    function create_if_block_1$b(ctx) {
    	var ol, current;

    	let each_value = ctx.pagination.siblings;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			add_location(ol, file$m, 14, 6, 273);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.pagination) {
    				each_value = ctx.pagination.siblings;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ol, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ol);
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$b.name, type: "if", source: "(14:4) {#if pagination.siblings}", ctx });
    	return block;
    }

    // (20:12) <Link target={item} replace={true}>
    function create_default_slot_2(ctx) {
    	var span0, t0_value = ctx.i+1 + "", t0, t1, span1, t2_value = ctx.item.title + "", t2;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(t2_value);
    			attr_dev(span0, "class", "num");
    			add_location(span0, file$m, 20, 14, 467);
    			attr_dev(span1, "class", "title");
    			add_location(span1, file$m, 21, 14, 512);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.pagination) && t2_value !== (t2_value = ctx.item.title + "")) {
    				set_data_dev(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span0);
    				detach_dev(t1);
    				detach_dev(span1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_2.name, type: "slot", source: "(20:12) <Link target={item} replace={true}>", ctx });
    	return block;
    }

    // (16:8) {#each pagination.siblings as item, i}
    function create_each_block$a(ctx) {
    	var li, t, li_class_value, current;

    	var link = new Link({
    		props: {
    		target: ctx.item,
    		replace: true,
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			li = element("li");
    			link.$$.fragment.c();
    			t = space();
    			attr_dev(li, "class", li_class_value = ctx.item.url == ctx.pagination.current.url ? 'current' : '');
    			add_location(li, file$m, 17, 10, 336);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			append_dev(li, t);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.pagination) link_changes.target = ctx.item;
    			if (changed.$$scope || changed.pagination) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);

    			if ((!current || changed.pagination) && li_class_value !== (li_class_value = ctx.item.url == ctx.pagination.current.url ? 'current' : '')) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}

    			destroy_component(link);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$a.name, type: "each", source: "(16:8) {#each pagination.siblings as item, i}", ctx });
    	return block;
    }

    // (35:4) {:else}
    function create_else_block$7(ctx) {
    	var current;

    	var link = new Link({
    		props: {
    		target: ctx.pagination.parent,
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			link.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.pagination) link_changes.target = ctx.pagination.parent;
    			if (changed.$$scope) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$7.name, type: "else", source: "(35:4) {:else}", ctx });
    	return block;
    }

    // (31:4) {#if pagination.next }
    function create_if_block$f(ctx) {
    	var current;

    	var link = new Link({
    		props: {
    		target: ctx.pagination.next,
    		replace: true,
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			link.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.pagination) link_changes.target = ctx.pagination.next;
    			if (changed.$$scope || changed.pagination) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$f.name, type: "if", source: "(31:4) {#if pagination.next }", ctx });
    	return block;
    }

    // (36:6) <Link target={pagination.parent} >
    function create_default_slot_1(ctx) {
    	var abbr;

    	const block = {
    		c: function create() {
    			abbr = element("abbr");
    			abbr.textContent = "Back";
    			attr_dev(abbr, "title", "Back to start");
    			add_location(abbr, file$m, 36, 8, 850);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, abbr, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(abbr);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1.name, type: "slot", source: "(36:6) <Link target={pagination.parent} >", ctx });
    	return block;
    }

    // (32:6) <Link target={pagination.next} replace={true} >
    function create_default_slot$2(ctx) {
    	var abbr, t, abbr_title_value;

    	const block = {
    		c: function create() {
    			abbr = element("abbr");
    			t = text("→");
    			attr_dev(abbr, "title", abbr_title_value = "Previous: " + ctx.pagination.next.title);
    			add_location(abbr, file$m, 32, 8, 718);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, abbr, anchor);
    			append_dev(abbr, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.pagination) && abbr_title_value !== (abbr_title_value = "Previous: " + ctx.pagination.next.title)) {
    				attr_dev(abbr, "title", abbr_title_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(abbr);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$2.name, type: "slot", source: "(32:6) <Link target={pagination.next} replace={true} >", ctx });
    	return block;
    }

    function create_fragment$n(ctx) {
    	var nav, t0, t1, current_block_type_index, if_block2, current;

    	var if_block0 = (ctx.pagination.prev) && create_if_block_2$5(ctx);

    	var if_block1 = (ctx.pagination.siblings) && create_if_block_1$b(ctx);

    	var if_block_creators = [
    		create_if_block$f,
    		create_else_block$7
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.pagination.next) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if_block2.c();
    			attr_dev(nav, "class", "pagination bar controls");
    			add_location(nav, file$m, 8, 0, 100);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if (if_block0) if_block0.m(nav, null);
    			append_dev(nav, t0);
    			if (if_block1) if_block1.m(nav, null);
    			append_dev(nav, t1);
    			if_blocks[current_block_type_index].m(nav, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.pagination.prev) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_2$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(nav, t0);
    				}
    			} else if (if_block0) {
    				group_outros();
    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});
    				check_outros();
    			}

    			if (ctx.pagination.siblings) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_1$b(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(nav, t1);
    				}
    			} else if (if_block1) {
    				group_outros();
    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});
    				check_outros();
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block2 = if_blocks[current_block_type_index];
    				if (!if_block2) {
    					if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block2.c();
    				}
    				transition_in(if_block2, 1);
    				if_block2.m(nav, null);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(nav);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$n.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { pagination } = $$props;

      // ← →

    	const writable_props = ['pagination'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('pagination' in $$props) $$invalidate('pagination', pagination = $$props.pagination);
    	};

    	$$self.$capture_state = () => {
    		return { pagination };
    	};

    	$$self.$inject_state = $$props => {
    		if ('pagination' in $$props) $$invalidate('pagination', pagination = $$props.pagination);
    	};

    	return { pagination };
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, ["pagination"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Pagination", options, id: create_fragment$n.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.pagination === undefined && !('pagination' in props)) {
    			console.warn("<Pagination> was created without expected prop 'pagination'");
    		}
    	}

    	get pagination() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pagination(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/liebling-house/tourNavigation.svelte generated by Svelte v3.12.1 */

    const file$n = "src/liebling-house/tourNavigation.svelte";

    function create_fragment$o(ctx) {
    	var section, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			section = element("section");

    			if (default_slot) default_slot.c();

    			attr_dev(section, "class", "tab invitation");
    			add_location(section, file$n, 0, 0, 0);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(section_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$o.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { $$slots, $$scope };
    }

    class TourNavigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "TourNavigation", options, id: create_fragment$o.name });
    	}
    }

    /* src/liebling-house/world.svelte generated by Svelte v3.12.1 */
    const { console: console_1$6 } = globals;

    const file$o = "src/liebling-house/world.svelte";

    // (297:2) {#if world.loaded === false }
    function create_if_block_5(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "is-loading svelte-1kpfqp4");
    			add_location(div, file$o, 297, 3, 7185);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_5.name, type: "if", source: "(297:2) {#if world.loaded === false }", ctx });
    	return block;
    }

    // (309:35) 
    function create_if_block_2$6(ctx) {
    	var span0, t0_value = ctx.world.help + "", t0, t1, span1, t2;

    	var if_block0 = (ctx.world.roaming) && create_if_block_4$1(ctx);

    	var if_block1 = (ctx.world.dollhouse) && create_if_block_3$3(ctx);

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			span1 = element("span");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(span0, "class", "message");
    			add_location(span0, file$o, 310, 4, 7603);
    			attr_dev(span1, "class", "right");
    			add_location(span1, file$o, 312, 4, 7650);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span1, anchor);
    			if (if_block0) if_block0.m(span1, null);
    			append_dev(span1, t2);
    			if (if_block1) if_block1.m(span1, null);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.world) && t0_value !== (t0_value = ctx.world.help + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if (ctx.world.roaming) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(span1, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (ctx.world.dollhouse) {
    				if (!if_block1) {
    					if_block1 = create_if_block_3$3(ctx);
    					if_block1.c();
    					if_block1.m(span1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span0);
    				detach_dev(t1);
    				detach_dev(span1);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$6.name, type: "if", source: "(309:35) ", ctx });
    	return block;
    }

    // (307:3) {#if world.tooltips.item !== false}
    function create_if_block_1$c(ctx) {
    	var span, t_value = ctx.world.tooltips.item + "", t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "message");
    			add_location(span, file$o, 307, 4, 7511);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.world) && t_value !== (t_value = ctx.world.tooltips.item + "")) {
    				set_data_dev(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$c.name, type: "if", source: "(307:3) {#if world.tooltips.item !== false}", ctx });
    	return block;
    }

    // (303:2) {#if world.loaded === false }
    function create_if_block$g(ctx) {
    	var span, t0, t1_value = ctx.world.progress + "", t1, t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("Loading ");
    			t1 = text(t1_value);
    			t2 = text("% ... Please wait.");
    			attr_dev(span, "class", "message");
    			add_location(span, file$o, 303, 3, 7385);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.world) && t1_value !== (t1_value = ctx.world.progress + "")) {
    				set_data_dev(t1, t1_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(span);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$g.name, type: "if", source: "(303:2) {#if world.loaded === false }", ctx });
    	return block;
    }

    // (314:5) {#if world.roaming }
    function create_if_block_4$1(ctx) {
    	var button, t_value = ctx.world.roaming + "", t, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			add_location(button, file$o, 315, 6, 7704);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.world) && t_value !== (t_value = ctx.world.roaming + "")) {
    				set_data_dev(t, t_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_4$1.name, type: "if", source: "(314:5) {#if world.roaming }", ctx });
    	return block;
    }

    // (319:5) {#if world.dollhouse }
    function create_if_block_3$3(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Overview";
    			add_location(button, file$o, 320, 6, 7832);
    			dispose = listen_dev(button, "click", ctx.click_handler_1);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_3$3.name, type: "if", source: "(319:5) {#if world.dollhouse }", ctx });
    	return block;
    }

    function create_fragment$p(ctx) {
    	var t0, section, div1, div0, t1, t2, div2, div2_class_value, section_class_value, current, dispose;

    	var loadscript = new LoadScript({
    		props: { dependencies: ctx.dependencies },
    		$$inline: true
    	});
    	loadscript.$on("loaded", ctx.unityInit);

    	var if_block0 = (ctx.world.loaded === false) && create_if_block_5(ctx);

    	function select_block_type(changed, ctx) {
    		if (ctx.world.loaded === false) return create_if_block$g;
    		if (ctx.world.tooltips.item !== false) return create_if_block_1$c;
    		if (ctx.world.help !== false) return create_if_block_2$6;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block1 = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			loadscript.$$.fragment.c();
    			t0 = space();
    			section = element("section");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(div0, "id", "worldContainer");
    			attr_dev(div0, "class", "presentation-container");
    			add_location(div0, file$o, 295, 2, 7062);
    			attr_dev(div1, "class", "section--content svelte-1kpfqp4");
    			attr_dev(div1, "id", "view-liebling-house");
    			add_location(div1, file$o, 294, 1, 7004);
    			attr_dev(div2, "class", div2_class_value = "bar controls section--controls " + (ctx.world.tooltips.item ? 'hover' : '') + " svelte-1kpfqp4");
    			attr_dev(div2, "id", "view-liebling-house-controls");
    			add_location(div2, file$o, 301, 1, 7234);
    			attr_dev(section, "class", section_class_value = "" + ctx.classname + " " + ctx.view.type + " svelte-1kpfqp4");
    			add_location(section, file$o, 292, 0, 6960);
    			dispose = listen_dev(div0, "click", ctx.canvasClick);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			mount_component(loadscript, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(section, t2);
    			append_dev(section, div2);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.world.loaded === false) {
    				if (!if_block0) {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block1) {
    				if_block1.p(changed, ctx);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type && current_block_type(ctx);
    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			}

    			if ((!current || changed.world) && div2_class_value !== (div2_class_value = "bar controls section--controls " + (ctx.world.tooltips.item ? 'hover' : '') + " svelte-1kpfqp4")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if ((!current || changed.classname || changed.view) && section_class_value !== (section_class_value = "" + ctx.classname + " " + ctx.view.type + " svelte-1kpfqp4")) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadscript.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(loadscript.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(loadscript, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(section);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$p.name, type: "component", source: "", ctx });
    	return block;
    }

    function worldCallMethod( state ){
    	console.log( 'worldCallMethod('+state+')' );

    	switch (state) {
    		case 'Kiosk':
    		case 'Dollhouse':
    			break;
    		default:
    			state = 'FreeRoaming';
    	}
    	lieblingHouseWorldInstance.SendMessage('GameManager', state );
    }

    async function showWorlditemContent(worlditemId){
    	console.log('async function showWorlditemContent('+worlditemId+')');

    	var href = window.location.origin + '/' + worlditemId;
    	replaceContent( href, {}, true);
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { view, page, classname } = $$props;

    	const dependencies = [
    		view.content.unityLoader || "https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/liebling-house/Build/UnityLoader.js"
    	];

    	console.log( dependencies );

    	/*
    	*	deprecated functions ??
    	*/
    	window.worldSetState = state => {
    		console.warn('deprecated: window.worldSetState('+state+')');
    		worldCallMethod( state );
    	};
    	window.goThroughGlass = event => {
    		console.warn('deprecated: window.goThroughGlass('+event+')');
    		worldCallMethod('FreeRoaming');
    	};
    	window.teleportToItem = itemName => {
    		console.warn('deprecated: window.teleportToItem('+itemName+')');
    		lieblingHouseWorldInstance.SendMessage('GameManager', 'TeleportToItem', itemName );
    	};

    	/*
    	view.content
    		worlditemStart: worlditem
    		worlditemsList: ./i/liebling-house/worlditems.json
    		unityLoader:    ./Build/UnityLoader.js
    		unityJson:      ./Build/liebling-house-world.json

    		Weltfunktionen sind wie gehabt über `gameInstance.SendMessage('GameManager', [FUNCTION], [ARGUMENT])` erreichbar.
    		- GoToItem(string itemName)
    		- TeleportToItem(string itemName)
    		- FreeRoaming()
    		- Kiosk()
    		- Dollhouse()
    		- Stop() stoppt `GoToItem`

    		Verfügbare States
    		- FreeRoaming
    		- MovingToItem
    		- ViewingDollhouse
    		- ViewingItem
    		- ViewingKiosk
    		- (ViewingPlatform)
    	*/

    	var world = {
    		loaded: false,
    		progress: 0,
    		setInitialState: false,
    		tooltips: {
    			item: false,
    			help: false
    		},
    		roaming: "Start exploring",
    		dollhouse: false,
    		help: "Click on the builing to start exploring.",
    		state: 'ViewingKiosk',
    		states: {
    			FreeRoaming: {
    				roaming: false,
    				dollhouse: true,
    				help: "Use W ← A ↑ S ↓ D → to navigate and drag to rotate camera."
    			},
    			MovingToItem: {
    				roaming: "Stop",
    				dollhouse: false,
    				help: false
    			},
    			ViewingDollhouse: {
    				roaming: "Continue exploring",
    				dollhouse: false,
    				help: "Drag to rotate building or click on one of the highlighted spots."
    			},
    			ViewingItem: {
    				roaming: "Continue exploring",
    				dollhouse: true,
    				help: "Click to start exploring."
    			},
    			ViewingKiosk: {
    				roaming: "Start exploring",
    				dollhouse: false,
    				help: "Click on the builing to start exploring."
    			},
    		}
    	};
    	onDestroy(() => {
    		console.log("onDestroy()");
    		lieblingHouseWorldInstance.Quit(function() {
    		    console.log("lieblingHouseWorldInstance.Quit");
    		});
    		lieblingHouseWorldInstance = null;
    	});
    	/*
    	* load and ini world
    	*/
    	function unityInit(){
    		console.log("unityInit()");

    		// return;

    		// https://docs.unity3d.com/Manual/webgl-templates.html
    		lieblingHouseWorldContainer = document.getElementById('worldContainer');
    		lieblingHouseWorldInstance = UnityLoader.instantiate(
    			lieblingHouseWorldContainer,
    			view.content.unityJson,
    			{ onProgress: UnityProgress }
    		);

    	}	function UnityProgress(lieblingHouseWorldInstance, progress) {

    		if (!lieblingHouseWorldInstance.Module) {
    			return;
    		}

    		$$invalidate('world', world.progress = Math.round( progress*100 ), world);

    		if (progress === 1 && !lieblingHouseWorldInstance.removeTimeout) {
    			lieblingHouseWorldInstance.removeTimeout = setTimeout(function() {

    				$$invalidate('world', world.loaded = true, world);
    				console.log('Unity loaded');

    			}, 3000);
    		}

    	}
    	/*
    	* alias
    	*/
    	window.worldCallMethod = state => {
    		worldCallMethod( state );
    	};
    	/*
    	* control world -> website
    	*
    	* onWorldReady
    	* worldUpdateState
    	* worldHoverItem
    	* worldSelectItem
    	* worldSelectTourstopOfItem
    	*/
    	window.onWorldReady = () => {
    		console.log('window.onWorldReady()');

    		if( page === 'overview' ){
    			worldCallMethod('Kiosk');
    		} else if( view.content.worlditemStart ){
    			console.log( 'could navigate to "'+view.content.worlditemStart+'"' );
    			lieblingHouseWorldInstance.SendMessage('GameManager', 'TeleportToItem', view.content.worlditemStart );
    		} else {
    			worldCallMethod('Kiosk');
    		}

    	};
    	let setInitialState = false;
    	window.worldUpdateState = state => {
    		if( setInitialState === false && state === 'FreeRoaming' ){
    			console.log('window.worldUpdateState('+state+') -> window.onWorldReady()');
    			window.onWorldReady();
    			setInitialState = true;
    		}
    		console.log('window.worldUpdateState('+state+')');

    		switch (state) {
    			case 'ViewingPlatform':
    				console.warn('deprecated: ViewingPlatform state');
    			case 'MovingToItem':
    			case 'ViewingDollhouse':
    			case 'ViewingItem':
    			case 'ViewingKiosk':
    				break;
    			default:
    				state = 'FreeRoaming';
    		}

    		$$invalidate('world', world.state = state, world);

    		$$invalidate('world', world.roaming = world.states[ state ].roaming, world);
    		$$invalidate('world', world.dollhouse = world.states[ state ].dollhouse, world);
    		$$invalidate('world', world.help = world.states[ state ].help, world);

    	};
    	window.worldHoverItem = worlditemId => {
    		console.log('window.worldHoverItem('+worlditemId+')');

    		if( worlditemId == '' ){
    			// console.log('worldHoverItem() mouse leave');
    			$$invalidate('world', world.tooltips.item = false, world);
    		} else {
    			$$invalidate('world', world.tooltips.item = worlditemId, world);
    		}
    		// maybe highlight collection elements by id?
    		return true;
    	};
    	window.worldSelectItem = worlditemId => {
    		console.log('window.worldSelectItem('+worlditemId+')');
    		if( worlditemId == '' ){
    			return false;
    		}
    		/* will directly navigate to this entity */
    		showWorlditemContent( worlditemId );
    		return true;
    	};
    	window.worldSelectTourstopOfItem = tourstopId => {
    		console.log('window.worldSelectTourstopOfItem('+tourstopId+')');
    		if( tourstopId == '' ){
    			return false;
    		}
    		/* will navigate to tourstop within world */
    		naviFromWorld( tourstopId );
    		return true;
    	};
    	/*
    	* helpers
    	*/
    	window.worldFreeRoaming = arg => {
    		console.log('window.worldFreeRoaming()');
    		worldCallMethod('FreeRoaming');
    	};
    	window.goToItem = itemName => {
    		console.log('window.goToItem('+itemName+')');
    		lieblingHouseWorldInstance.SendMessage('GameManager', 'GoToItem', itemName );
    	};
    	function canvasClick(){
    		console.log('canvasClick()');
    		if( world.state === 'Kiosk '){
    			worldCallMethod('FreeRoaming');
    		}
    	}

    	const writable_props = ['view', 'page', 'classname'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console_1$6.warn(`<World> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => worldCallMethod('FreeRoaming');

    	const click_handler_1 = () => worldCallMethod('Dollhouse');

    	$$self.$set = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    	};

    	$$self.$capture_state = () => {
    		return { view, page, classname, world, setInitialState };
    	};

    	$$self.$inject_state = $$props => {
    		if ('view' in $$props) $$invalidate('view', view = $$props.view);
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    		if ('classname' in $$props) $$invalidate('classname', classname = $$props.classname);
    		if ('world' in $$props) $$invalidate('world', world = $$props.world);
    		if ('setInitialState' in $$props) setInitialState = $$props.setInitialState;
    	};

    	return {
    		view,
    		page,
    		classname,
    		dependencies,
    		world,
    		unityInit,
    		canvasClick,
    		click_handler,
    		click_handler_1
    	};
    }

    class World extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, ["view", "page", "classname"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "World", options, id: create_fragment$p.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.view === undefined && !('view' in props)) {
    			console_1$6.warn("<World> was created without expected prop 'view'");
    		}
    		if (ctx.page === undefined && !('page' in props)) {
    			console_1$6.warn("<World> was created without expected prop 'page'");
    		}
    		if (ctx.classname === undefined && !('classname' in props)) {
    			console_1$6.warn("<World> was created without expected prop 'classname'");
    		}
    	}

    	get view() {
    		throw new Error("<World>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<World>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<World>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<World>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classname() {
    		throw new Error("<World>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classname(value) {
    		throw new Error("<World>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/liebling-house/template.svelte generated by Svelte v3.12.1 */

    const file$p = "src/liebling-house/template.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.tab = list[i];
    	return child_ctx;
    }

    // (76:2) {#if page.content}
    function create_if_block_1$d(ctx) {
    	var main, div1, div0, t0, current_block_type_index, if_block1, t1, main_class_value, current, dispose;

    	var if_block0 = (ctx.page.loading) && create_if_block_5$1(ctx);

    	var if_block_creators = [
    		create_if_block_2$7,
    		create_if_block_3$4,
    		create_if_block_4$2
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.page.category == 'overview') return 0;
    		if (ctx.page.category == 'tour') return 1;
    		if (ctx.page.category == 'tourstop' && ctx.page.pagination) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(null, ctx))) {
    		if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	let each_value = ctx.page.content;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    			attr_dev(div0, "class", "tabs");
    			add_location(div0, file$p, 79, 5, 1721);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$p, 77, 6, 1693);
    			attr_dev(main, "class", main_class_value = "panel col-sm-3 " + ctx.page.category);
    			add_location(main, file$p, 76, 4, 1564);

    			dispose = [
    				listen_dev(main, "click", ctx.window.touchGlass),
    				listen_dev(main, "scroll", ctx.scrolling, { passive: true })
    			];
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (~current_block_type_index) if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			ctx.main_binding(main);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.page.loading) {
    				if (!if_block0) {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				if (if_block1) {
    					group_outros();
    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});
    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block1 = if_blocks[current_block_type_index];
    					if (!if_block1) {
    						if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block1.c();
    					}
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				} else {
    					if_block1 = null;
    				}
    			}

    			if (changed.tabs || changed.page) {
    				each_value = ctx.page.content;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}

    			if ((!current || changed.page) && main_class_value !== (main_class_value = "panel col-sm-3 " + ctx.page.category)) {
    				attr_dev(main, "class", main_class_value);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block1);

    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(main);
    			}

    			if (if_block0) if_block0.d();
    			if (~current_block_type_index) if_blocks[current_block_type_index].d();

    			destroy_each(each_blocks, detaching);

    			ctx.main_binding(null);
    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$d.name, type: "if", source: "(76:2) {#if page.content}", ctx });
    	return block;
    }

    // (82:10) {#if page.loading}
    function create_if_block_5$1(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "is-loading");
    			add_location(div, file$p, 81, 28, 1769);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_5$1.name, type: "if", source: "(82:10) {#if page.loading}", ctx });
    	return block;
    }

    // (93:64) 
    function create_if_block_4$2(ctx) {
    	var current;

    	var pagination = new Pagination({
    		props: { pagination: ctx.page.pagination },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			pagination.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(pagination, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var pagination_changes = {};
    			if (changed.page) pagination_changes.pagination = ctx.page.pagination;
    			pagination.$set(pagination_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(pagination, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_4$2.name, type: "if", source: "(93:64) ", ctx });
    	return block;
    }

    // (88:40) 
    function create_if_block_3$4(ctx) {
    	var current;

    	var tournavigation = new TourNavigation({
    		props: {
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			tournavigation.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(tournavigation, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var tournavigation_changes = {};
    			if (changed.$$scope || changed.page) tournavigation_changes.$$scope = { changed, ctx };
    			tournavigation.$set(tournavigation_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(tournavigation.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(tournavigation.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(tournavigation, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_3$4.name, type: "if", source: "(88:40) ", ctx });
    	return block;
    }

    // (84:6) {#if page.category == 'overview'}
    function create_if_block_2$7(ctx) {
    	var current;

    	var tournavigation = new TourNavigation({
    		props: {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			tournavigation.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(tournavigation, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var tournavigation_changes = {};
    			if (changed.$$scope) tournavigation_changes.$$scope = { changed, ctx };
    			tournavigation.$set(tournavigation_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(tournavigation.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(tournavigation.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(tournavigation, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$7.name, type: "if", source: "(84:6) {#if page.category == 'overview'}", ctx });
    	return block;
    }

    // (91:14) <Link target={page.content[1].content[0]} class="button blue">
    function create_default_slot_2$1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Start promenade →");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_2$1.name, type: "slot", source: "(91:14) <Link target={page.content[1].content[0]} class=\"button blue\">", ctx });
    	return block;
    }

    // (89:7) <TourNavigation>
    function create_default_slot_1$1(ctx) {
    	var current;

    	var link = new Link({
    		props: {
    		target: ctx.page.content[1].content[0],
    		class: "button blue",
    		$$slots: { default: [create_default_slot_2$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			link.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.page) link_changes.target = ctx.page.content[1].content[0];
    			if (changed.$$scope) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1$1.name, type: "slot", source: "(89:7) <TourNavigation>", ctx });
    	return block;
    }

    // (85:7) <TourNavigation>
    function create_default_slot$3(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start exploring →";
    			attr_dev(button, "class", "blue");
    			add_location(button, file$p, 85, 8, 1878);
    			dispose = listen_dev(button, "click", ctx.window.worldFreeRoaming);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$3.name, type: "slot", source: "(85:7) <TourNavigation>", ctx });
    	return block;
    }

    // (97:6) {#each page.content as tab}
    function create_each_block$b(ctx) {
    	var switch_instance_anchor, current;

    	var switch_value = ctx.tabs[ ctx.tab.type ];

    	function switch_props(ctx) {
    		return {
    			props: {
    			tab: ctx.tab,
    			category: ctx.page.category,
    			entity: ctx.page.entity
    		},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) switch_instance.$$.fragment.c();
    			switch_instance_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var switch_instance_changes = {};
    			if (changed.page) switch_instance_changes.tab = ctx.tab;
    			if (changed.page) switch_instance_changes.category = ctx.page.category;
    			if (changed.page) switch_instance_changes.entity = ctx.page.entity;

    			if (switch_value !== (switch_value = ctx.tabs[ ctx.tab.type ])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;
    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});
    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));

    					switch_instance.$$.fragment.c();
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}

    			else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(switch_instance_anchor);
    			}

    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$b.name, type: "each", source: "(97:6) {#each page.content as tab}", ctx });
    	return block;
    }

    // (107:2) {#if page.view}
    function create_if_block$h(ctx) {
    	var current;

    	var world = new World({
    		props: {
    		view: ctx.page.view,
    		page: ctx.page.category,
    		classname: "presentation panel col-12"
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			world.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(world, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var world_changes = {};
    			if (changed.page) world_changes.view = ctx.page.view;
    			if (changed.page) world_changes.page = ctx.page.category;
    			world.$set(world_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(world.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(world.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(world, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$h.name, type: "if", source: "(107:2) {#if page.view}", ctx });
    	return block;
    }

    function create_fragment$q(ctx) {
    	var div, t, current;

    	var if_block0 = (ctx.page.content) && create_if_block_1$d(ctx);

    	var if_block1 = (ctx.page.view) && create_if_block$h(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "grid panels overlap");
    			add_location(div, file$p, 73, 0, 1504);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.page.content) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1$d(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();
    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});
    				check_outros();
    			}

    			if (ctx.page.view) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$h(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();
    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$q.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	
    	let tabs = {
    		header: Header,
    		collection: Collection$1,
    		table: Table,
    		text: Text
      };

    	let { page } = $$props;

    	let glass;
    	window.touchGlass = event => {
    		if( page.view.type !== 'liebling-house' ){
    			return false;
    		}
    		if( event.target !== glass ){
    			return false;
    		}
    		window.goThroughGlass();
    	};

    	var isScrolled = false;
    	var isScrolledPrev = false;
    	function scrolling(){
    		if( glass.scrollTop > 100 ){
    			isScrolled = true;
    		} else {
    			isScrolled = false;
    		}
    		if( isScrolled === isScrolledPrev ){
    			return;
    		}
    		isScrolledPrev = isScrolled;

    		if( isScrolledPrev === true ){
    			document.body.classList.add('scrolled');
    			// console.log('scrolled');
    		} else {
    			document.body.classList.remove('scrolled');
    			// console.log('top');
    		}
    	}

      document.body.classList.add('liebling-house');
    	onDestroy(() => {
    		document.body.classList.remove('liebling-house');
    	});

    	const writable_props = ['page'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Template> was created with unknown prop '${key}'`);
    	});

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('glass', glass = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    	};

    	$$self.$capture_state = () => {
    		return { tabs, page, glass, isScrolled, isScrolledPrev };
    	};

    	$$self.$inject_state = $$props => {
    		if ('tabs' in $$props) $$invalidate('tabs', tabs = $$props.tabs);
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    		if ('glass' in $$props) $$invalidate('glass', glass = $$props.glass);
    		if ('isScrolled' in $$props) isScrolled = $$props.isScrolled;
    		if ('isScrolledPrev' in $$props) isScrolledPrev = $$props.isScrolledPrev;
    	};

    	return {
    		tabs,
    		page,
    		glass,
    		scrolling,
    		window,
    		main_binding
    	};
    }

    class Template extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, ["page"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Template", options, id: create_fragment$q.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.page === undefined && !('page' in props)) {
    			console.warn("<Template> was created without expected prop 'page'");
    		}
    	}

    	get page() {
    		throw new Error("<Template>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Template>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    async function loadPage( url = false, title = false ) {

    	let state = createStateObject({
    		title: title || document.title.replace('CDA ',''),
    		url: url || window.location.href,
    		template: assumeTemplate( window.location.pathname )
    	});

    	pageStoreSet({...state, loading: true});
    	historyStoreAdd( state );

    	// load data
    	let data = await loadData( state.url );

    	if( data.html ){
    		data.url = state.url;
    		data.title = state.title;
    		data.template = 'html';
    	} else {
    		state = createStateObject( data );
    	}

    	// replace info in page object and history
    	pageStoreSet({...data, loading: false});

    	// naviWorld( entity.worlditem );

    	history.replaceState( state, state.title, state.url );
    	historyStoreReplaceLast( state );

    }

    async function navigateBack( target ) {

    	// use info provided by old state object for
    	pageStoreSet({...target, loading: true});
    	historyStoreRemoveLast();

    	let data = await loadData( target.url );

    	let classlist = ['dynamic', data.theme, data.layout, data.template, data.type, data.entity];

    	// replace info in page object and history
    	pageStoreSet({...data , loading: false });

    	document.body.className = classlist.join(' ');

    	// naviWorld( entity.worlditem );

    }

    async function popState( event ){

    	if( event.state ){

    		console.log( 'popState('+event.state.url+')' );
    		navigateBack( event.state );

    	} else {

    		throw Error('popState() no history.state object');

    	}

    }

    function clickAnyLink( event ){

    	let anchor = event.target.closest('a');
    	if( anchor && anchor.classList.contains('follow') ){
    		console.log('clickAnyLink',anchor);
    		event.preventDefault();
    		navigateTo( anchor.href );
    	}

    }

    /* src/App.svelte generated by Svelte v3.12.1 */

    const file$q = "src/App.svelte";

    // (71:1) {#if page.loading}
    function create_if_block_4$3(ctx) {
    	var div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "is-loading");
    			add_location(div, file$q, 70, 19, 1609);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_4$3.name, type: "if", source: "(71:1) {#if page.loading}", ctx });
    	return block;
    }

    // (65:39) 
    function create_if_block_3$5(ctx) {
    	var current;

    	var archivetemplate = new Archive({
    		props: { page: ctx.page },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			archivetemplate.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(archivetemplate, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var archivetemplate_changes = {};
    			if (changed.page) archivetemplate_changes.page = ctx.page;
    			archivetemplate.$set(archivetemplate_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(archivetemplate.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(archivetemplate.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(archivetemplate, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_3$5.name, type: "if", source: "(65:39) ", ctx });
    	return block;
    }

    // (55:38) 
    function create_if_block_1$e(ctx) {
    	var current_block_type_index, if_block, t, current;

    	var if_block_creators = [
    		create_if_block_2$8,
    		create_else_block$8
    	];

    	var if_blocks = [];

    	function select_block_type_1(changed, ctx) {
    		if (ctx.page.view && ctx.page.view.type === 'liebling-house') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	var archivebar = new ArchiveBar({
    		props: { page: ctx.page },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    			archivebar.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(archivebar, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(t.parentNode, t);
    			}

    			var archivebar_changes = {};
    			if (changed.page) archivebar_changes.page = ctx.page;
    			archivebar.$set(archivebar_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			transition_in(archivebar.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(archivebar.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach_dev(t);
    			}

    			destroy_component(archivebar, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_1$e.name, type: "if", source: "(55:38) ", ctx });
    	return block;
    }

    // (49:0) {#if page.template === 'html' }
    function create_if_block$i(ctx) {
    	var div, raw_value = ctx.page.html + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$q, 50, 1, 1284);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},

    		p: function update(changed, ctx) {
    			if ((changed.page) && raw_value !== (raw_value = ctx.page.html + "")) {
    				div.innerHTML = raw_value;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$i.name, type: "if", source: "(49:0) {#if page.template === 'html' }", ctx });
    	return block;
    }

    // (59:1) {:else}
    function create_else_block$8(ctx) {
    	var current;

    	var entitytemplate = new Entity({
    		props: { page: ctx.page },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			entitytemplate.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(entitytemplate, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var entitytemplate_changes = {};
    			if (changed.page) entitytemplate_changes.page = ctx.page;
    			entitytemplate.$set(entitytemplate_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(entitytemplate.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(entitytemplate.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(entitytemplate, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$8.name, type: "else", source: "(59:1) {:else}", ctx });
    	return block;
    }

    // (57:1) {#if page.view && page.view.type === 'liebling-house'}
    function create_if_block_2$8(ctx) {
    	var current;

    	var lieblinghouse = new Template({
    		props: { page: ctx.page },
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			lieblinghouse.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(lieblinghouse, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var lieblinghouse_changes = {};
    			if (changed.page) lieblinghouse_changes.page = ctx.page;
    			lieblinghouse.$set(lieblinghouse_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(lieblinghouse.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(lieblinghouse.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(lieblinghouse, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block_2$8.name, type: "if", source: "(57:1) {#if page.view && page.view.type === 'liebling-house'}", ctx });
    	return block;
    }

    function create_fragment$r(ctx) {
    	var title_value, t0, t1, current_block_type_index, if_block, if_block_anchor, current, dispose;

    	document.title = title_value = "CDA " + ctx.page.title;

    	var historybar = new HistoryBar({ $$inline: true });

    	var if_block_creators = [
    		create_if_block$i,
    		create_if_block_1$e,
    		create_if_block_3$5,
    		create_if_block_4$3
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.page.template === 'html') return 0;
    		if (ctx.page.template === 'entity') return 1;
    		if (ctx.page.template === 'archive') return 2;
    		if (ctx.page.loading) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(null, ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			t0 = space();
    			historybar.$$.fragment.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			dispose = [
    				listen_dev(window, "popstate", popState),
    				listen_dev(window, "click", clickAnyLink)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			mount_component(historybar, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (~current_block_type_index) if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.page) && title_value !== (title_value = "CDA " + ctx.page.title)) {
    				document.title = title_value;
    			}

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				if (if_block) {
    					group_outros();
    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});
    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];
    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(historybar.$$.fragment, local);

    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(historybar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t0);
    			}

    			destroy_component(historybar, detaching);

    			if (detaching) {
    				detach_dev(t1);
    			}

    			if (~current_block_type_index) if_blocks[current_block_type_index].d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$r.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	
    	onMount(async () => {
    		loadPage();
    	});

    	let page = {};
      const unsubscribe = pageStore.subscribe(value => {
    		for (var prop in value) {
    			if( value[prop] !== page[prop] ){
    				$$invalidate('page', page[prop] = value[prop], page);
    			}
    		}
    		// page = value;
    		console.log( page );
      });

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate('page', page = $$props.page);
    	};

    	return { page };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$r.name });
    	}
    }

    console.log('CDA Centre for Documentary Architecture');

    const app = new App({
    	target: document.querySelector('#frontend')
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
