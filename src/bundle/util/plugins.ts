import type { Plugin, PluginEnables } from '@/types'
import IDBMap from '@webreflection/idb-map'

const pluginDb = new IDBMap('plugins')

export async function getEnabledPlugins(
  href: string,
  check?: keyof PluginEnables
) {
  const enabled: Plugin[] = []

  for (const plugin of self.$meteor.config.plugins) {
    const pluginData: PluginEnables = await pluginDb.get(plugin.name)
    if (plugin.filter.test(href)) {
      if ((check && pluginData[check] && check in plugin) || !check) {
        enabled.push(plugin)
      }
    }
  }
  return enabled
}

self.addEventListener('message', async (event) => {
  try {
    const data: PluginEnables = event.data
    if (data.type !== 'meteor-plugin') return
    self.$meteor.util.log(`Changing plugin options for ${data.name}.`, 'teal')
    if (data.setAll !== undefined) {
      await pluginDb.set(data.name, {
        name: data.name,
        onRequest: data.setAll,
        inject: data.setAll,
        handleClient: data.setAll
      } satisfies PluginEnables)
      return
    }
    await pluginDb.set(data.name, data)
  } catch (e) {
    self.$meteor.util.log(e)
    throw e
  }
})
