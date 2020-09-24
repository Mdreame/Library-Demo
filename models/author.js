const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// 虚拟属性'name'：表示作者全名
AuthorSchema
  .virtual('name')
  .get(function () {
    return this.family_name + ', ' + this.first_name;
  });

// 虚拟属性'lifespan'：作者寿命
AuthorSchema
  .virtual('lifespan_formatted')
  .get(function () {
    let birthDate = this.date_of_birth ? moment(this.date_of_birth).format('YYYY-MM-DD') : '';
    let deadDate = this.date_of_death ? moment(this.date_of_death).format('YYYY-MM-DD') : '';
    return birthDate + ' ~ ' + deadDate;
  });

// 虚拟属性'url'：作者 URL
AuthorSchema
  .virtual('url')
  .get(function () {
    return '/catalog/author/' + this._id;
  });

// 导出 Author 模型
module.exports = mongoose.model('Author', AuthorSchema);