const db = wx.cloud.database(); //拿到数据库引用

//直接返回promise对象
function add(_collection, _data = {}) {
  return db.collection(_collection).add({
    data: _data
  })
}

/*
  删除
*/
function remove(_collection, _id) {
  return db.collection(_collection).doc(_id).remove()
}

/*
更新
*/
function update(_collection, _id, _data = {}) {
  return db.collection(_collection).doc(_id).update({
    data: _data
  })
}
/*
  更新实现累加
*/
function addNumber(_collection, id, num) {
  return db.collection(_collection).doc(id).update({
    data: {
      view: db.command.inc(num)
    }
  })
}

/*
  查询
*/
function get(_collection, _where = {}) {
  return db.collection(_collection).where(_where).get()
}
/*
  查询
  @params _collection  集合名称
          _where        条件  {}
*/
function getLimit(_collection, _where = {}, _time, _sort, _skip, _limit) {
  return db.collection(_collection).orderBy(_time, _sort).skip(_skip).limit(_limit).where(_where).get()
}
/*
  查询一条记录
*/
function getOne(_collection, _doc) {
  return db.collection(_collection).doc(_doc).get()
}

export {
  add,
  remove,
  update,
  get,
  getOne,
  addNumber,
  getLimit
}