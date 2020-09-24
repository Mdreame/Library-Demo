const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// 显示完整的副本列表
exports.genre_list = (req, res,next) => { 
    Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, list_genres) => {
        if(err) {return next(err)}
        res.render('genre_list', {title: 'Genre List', genre_list: list_genres});
    })
 };

// 为每位副本显示详细信息的页面
exports.genre_detail = (req, res, next) => { 

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
          Book.find({ 'genre': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });
 };

// 由 GET 显示创建副本的表单
exports.genre_create_get = (req, res, next) => { 
    res.render('genre_form', { title: 'Create Genre'});
 };

// 由 POST 处理副本创建操作
exports.genre_create_post =  [
   
    // 验证name不为空，且删除前后空格
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // 清理和转义可能存在危险的html字符
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a genre object with escaped and trimmed data.
        var genre = new Genre(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                     if (err) { return next(err); }

                     if (found_genre) {
                         // Genre exists, redirect to its detail page.
                         res.redirect(found_genre.url);
                     }
                     else {

                         genre.save(function (err) {
                           if (err) { return next(err); }
                           // Genre saved. Redirect to genre detail page.
                           res.redirect(genre.url);
                         });

                     }

                 });
        }
    }
];

// 由 GET 显示删除副本的表单
exports.genre_delete_get = (req, res) => { res.send('未实现：副本删除表单的 GET'); };

// 由 POST 处理副本删除操作
exports.genre_delete_post = (req, res) => { res.send('未实现：删除副本的 POST'); };

// 由 GET 显示更新副本的表单
exports.genre_update_get = (req, res) => { res.send('未实现：副本更新表单的 GET'); };

// 由 POST 处理副本更新操作
exports.genre_update_post = (req, res) => { res.send('未实现：更新副本的 POST'); };