var proxy = new Proxy({},{
  get: function(obj, prop) {
    return get(obj, prop)
  },
  set: function(obj, prop, value) {
    return set(obj, prop, value)
  }
})

function set(obj, prop, value) {
  // if (prop != 'currentTime')
  //   console.log(obj._template,prop,value)
  obj[prop] = value;

  // for single values where we dont want to update the full template (i.e current time)
  if (!obj._template && document.getElementById(prop)) {
    if (prop == 'currentTime') {
      document.getElementById('timebar-filler').style.width = template.defaults.imports.timebarPercent(proxy.currentTime/proxy.bar.duration) + '%'
      document.getElementById(prop).innerHTML = template.defaults.imports.timeFormat(value)
    }
    else
      document.getElementById(prop).innerHTML = value
    return true;
  }
  for (let i = 0; i < templates.length; i++) {
    if (!obj || !obj._template) break;
    if (obj._template.startsWith(templates[i])) {
      if (!window[templates[i]]) return true;
      window[templates[i]].outerHTML = template(templates[i]+'.html', proxy)
      bind[templates[i]]()
    }
  }
  return true;
}

function get(obj, prop) {
  if (!(prop in obj))
    obj[prop] = new Proxy({_template: prop},{
      get: function(obj, prop) {
        return get(obj, prop)
      },
      set: function(obj, prop, value) {
        return set(obj, prop, value)
      }
    })

  return obj[prop]
}