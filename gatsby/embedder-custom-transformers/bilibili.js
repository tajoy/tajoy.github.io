const request = require(`sync-request`)

module.exports = {
  name: "bilibili.tv",
  shouldTransform(url) {
    const { host, pathname, searchParams } = new URL(url)

    return (
      [
        "bilibili.com",
        "www.bilibili.com",
        "bilibili.tv",
        "www.bilibili.tv",
      ].includes(host) && pathname.includes("/video/")
    )
  },
  getHTML(url) {
    const { pathname } = new URL(url)
    const bvid = pathname.replace("/video/", "").replace("/", "")
    const parseCid = response => {
      if (response.statusCode !== 200) return false
      try {
        response.data = JSON.parse(String(response.body))
      } catch (e) {
        console.error("parseCid error", e)
        return false
      }
      if (
        !response.data.data ||
        !response.data.data[0] ||
        !response.data.data[0].cid
      )
        return false
      if (response.data.data[0].page === undefined) return false
      return true
    }
    const parseAid = response => {
      if (response.statusCode !== 200) return false
      try {
        response.data = JSON.parse(String(response.body))
      } catch (e) {
        console.error("parseAid error", e)
        return false
      }
      if (!response.data.data || !response.data.data.aid) return false
      return true
    }
    const linkHtml = `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
    const responseCid = request(
      `GET`,
      `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}`
    )
    if (!parseCid(responseCid)) return linkHtml
    const cid = responseCid.data.data[0].cid
    const page = responseCid.data.data[0].page
    const responseAid = request(
      `GET`,
      `https://api.bilibili.com/x/web-interface/view?cid=${cid}&bvid=${bvid}`
    )
    if (!parseAid(responseAid)) return linkHtml
    const aid = responseAid.data.data.aid
    return `<iframe src="//player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}&page=${page}"  style="width:100%; height:500px;" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`
  },
}
