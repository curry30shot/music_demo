// api文件夹下 各个请求模块js, 都统一来到index.js再向外导出
import { newMusic, recommendMusic } from './Home'
import { hotSearch, searchResultList } from './Search'
import { getSongById, getLyricById } from './Play'

export const recommendMusicAPI = recommendMusic // 请求推荐歌单的方法导出
export const newMusicAPI = newMusic // 首页 - 最新音乐

export const hotSearchAPI = hotSearch // 搜索- 热词关键词搜索
export const searchResultListAPI = searchResultList // 关键字搜索结果

export const getSongByIdAPI = getSongById
export const getLyricByIdAPI = getLyricById
