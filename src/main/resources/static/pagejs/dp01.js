layui.use(['table', 'form', 'layer'], function () {
    const table = layui.table
    const form = layui.form
    const layer = layui.layer

    let totalCount = 0
    let pageLimit = 5

    let student = getSearchCondition()

    // 初始化表格
    table.render({
        elem: '#studentTable',
        url: '/api/student/getbypage',
        method: 'POST',
        page: true,
        limits: [5, 10, 15],
        limit: 10,
        contentType: 'application/json',
        request: {
            pageName: 'page',
            limitName: 'limit'
        },
        where: {
            "data": student
        },
        cols: [[
            {type: 'checkbox', fixed: 'left'},
            {field: 'id', title: 'ID', sort: true},

            {field: 'name', title: '姓名'},
            {
                field: 'sex', title: '性别',
                templet: function (d) {
                    return d.sex === 1 ? '男' : d.sex === 2 ? '女' : '未知'
                }
            },
            {field: 'age', title: '年龄', sort: true},
            {field: 'sno', title: '学号'},
            {field: 'password', title: '密码'},
            {
                title: '操作', align: 'center', toolbar: '#actionBar'
            }
        ]],
        done: function (res) {
            // 更新 totalCount 和 pageLimit
            totalCount = res.count // 总数据条数
            pageLimit = this.limit // 每页条数
        }
    })

    // 工具条事件
    table.on('tool(studentTable)', function (obj) {
        const data = obj.data
        if (obj.event === 'edit') {
            showStuDlg(data.id) // 编辑事件
        } else if (obj.event === 'delete') {
            deleteById(data.id) // 删除事件
        }
    })

    // 表格排序
    table.on('sort(studentTable)', function (obj) {
        table.reload('studentTable', {
            initSort: obj, // 记录当前排序状态
            where: {
                "data": {},
                "sortField": obj.field, // 排序字段
                "sortDirection": obj.type // 排序方式（asc 或 desc）
            },
            page: {
                curr: 1 // 重置为第一页
            }
        })
    })

    // 搜索事件
    $('#search-btn').on('click', function () {

        const student = {}

        const sno = $('input[name="search-sno"]').val()
        const name = $('input[name="search-name"]').val()
        const age = $('input[name="search-age"]').val()

        if(sno){
            student["sno"] = sno
        }
        if(name){
            student["name"] = name
        }
        if(age){
            student["age"] = age
        }

        // 重新加载表格
        table.reload('studentTable', {
            where: {
                "data": student
            },
            page: {
                curr: 1
            }
        })
    })

    // 重置事件
    $('#reset-btn').on('click', function () {
        $('input[name="search-sno"], input[name="search-name"], input[name="search-age"]').val('')
        table.reload('studentTable', {
            where: {
                "data": {}
            },
            page: {
                curr: 1
            }
        })
    })

    // 添加学生信息
    $('#add-btn').on('click', function () {
        showStuDlg()
    })

    // 获取搜索框内的信息
    function getSearchCondition(){
        let formData = {}
        $('#queryForm').find('input').each(function () {
            let name = $(this).attr('name')
            let value = $(this).val()

            if(name && value){
                formData[name] = value
            }
        })

        return formData
    }

    // 删除学生信息
    function deleteById(id) {
        layer.confirm('确认删除该生吗？', {icon: 3, title: '提示'}, function (index) {
            $.ajax({
                url: `/api/student/delete/${id}`,
                method: 'DELETE',
                success: function (res) {
                    if (res.code === 0) {
                        layer.msg('删除成功')

                        // 获取当前页和分页信息
                        const options = table.getOptions('studentTable') // 获取表格配置
                        const currentPage = options.page.curr // 当前页码
                        const pageSize = options.page.limit  // 每页条数

                        // 更新总记录数
                        totalCount -= 1

                        // 计算删除后的最大页码
                        const maxPage = Math.ceil(totalCount / pageSize)

                        // 计算新的页码
                        const newPage = currentPage > maxPage ? maxPage : currentPage
                        // 重新加载表格
                        table.reload('studentTable', {
                            page: {
                                curr: newPage // 根据逻辑跳转到适当页码
                            }
                        })
                    } else {
                        layer.msg('删除失败')
                    }
                },
                error: function () {
                    layer.msg('删除失败')
                }
            })
            layer.close(index)
        })
    }

    // 批量删除学生信息
    $('#delete-btn').on('click', function () {
        const checkStatus = table.checkStatus('studentTable') // 获取选中行
        const selectedIds = checkStatus.data.map(item => item.id) // 获取所有选中的 ID

        if (selectedIds.length === 0) {
            layer.msg('请先选择要删除的学生信息')
            return
        }

        layer.confirm(`确认删除选中的 ${selectedIds.length} 条记录吗？`, { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/api/student/batchDelete',
                method: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify(selectedIds),
                success: function (res) {
                    if (res.code === 0) {
                        layer.msg('批量删除成功')
                        // 获取当前页和分页信息
                        const options = table.getOptions('studentTable') // 获取表格配置
                        const currentPage = options.page.curr // 当前页码
                        const pageSize = options.page.limit  // 每页条数

                        // 更新总记录数
                        totalCount -= selectedIds.length

                        // 计算删除后的最大页码
                        const maxPage = Math.ceil(totalCount / pageSize)

                        // 计算新的页码
                        const newPage = currentPage > maxPage ? maxPage : currentPage
                        // 重新加载表格
                        table.reload('studentTable', {
                            page: {
                                curr: newPage // 根据逻辑跳转到适当页码
                            }
                        })
                    } else {
                        layer.msg('删除失败')
                    }
                },
                error: function () {
                    layer.msg('删除失败')
                }
            })
            layer.close(index)
        })
    })

    // 显示新增/编辑学生信息对话框
    function showStuDlg(id) {

        // 重置表单
        form.val('stuForm', { id: '', sno: '', name: '', sex: '', age: '', password: '' })

        layer.open({
            type: 1,
            title: id ? '编辑学生信息' : '添加学生信息',
            content: $('#stuForm'),
            area: ['520px', 'auto'],
            success: function () {
                if (id) {   // 更新情况
                    // 请求数据，填充表单
                    $.ajax({
                        url: `/api/student/${id}`,
                        method: 'GET',
                        success: function (res) {
                            if (res.code === 0) {
                                form.val('stuForm', res.data)
                            }
                        }
                    })
                } else {    // 添加情况
                    form.val('stuForm', {}) // 清空表单
                }
            }
        })
    }

    // 提交表单
    form.on('submit(stu-dlg)', function () {
        commitStuDlg()
        return false
    })

// 提交表单
    function commitStuDlg() {
        const id = form.val('stuForm').id; // 判断是否有 id，决定是新增还是更新
        const url = id ? '/api/student/update' : '/api/student/add';
        const method = id ? 'PUT' : 'POST';
        const data = form.val('stuForm');

        $.ajax({
            url,
            method,
            data: data,
            success: function (res) {
                if (res.code === 0) {
                    if (!id) {
                        // 如果是新增操作，计算最后一页并跳转
                        const lastPage = Math.ceil((totalCount + 1) / pageLimit);
                        table.reload('studentTable', {
                            page: {
                                curr: lastPage // 跳转到最后一页
                            }
                        });
                    }else {
                        // 获取当前页和分页信息
                        const options = table.getOptions('studentTable') // 获取表格配置
                        const currentPage = options.page.curr // 当前页码

                        // 重新加载表格
                        table.reload('studentTable', {
                            page: {
                                curr: currentPage
                            }
                        })
                    }
                    layer.closeAll();
                    layer.msg(`${id ? '更新' : '添加'}成功`);
                } else {
                    layer.msg(res.message || `${id ? '更新' : '添加'}失败`);
                }
            },
            error: function () {
                layer.msg(`${id ? '更新' : '添加'}失败`);
            }
        });
    }
})
//
// /**
//  * 渲染学生表格
//  * @param {Array} students - 学生数据
//  */
// function renderStudentTable(students) {
//     const tableBody = $('#studentTb')
//     tableBody.empty()
//
//     if (!students.data || students.data.length === 0) {
//         tableBody.append('<tr><td colspan="6">暂无数据</td></tr>')
//         return
//     }
//
//     students.data.forEach(student => {
//         const row = `
//             <tr>
//                 <td>${student.id}</td>
//                 <td>${student.name}</td>
//                 <td>${student.sex === 1 ? '男' : student.sex === 2 ? '女' : '未知'}</td>
//                 <td>${student.age}</td>
//                 <td>${student.sno}</td>
//                 <td>${student.password}</td>
//                 <td>
//                     <button type="button" class="layui-btn editBtn" onclick="showStuDlg(${student.id})">
//                         <i class="layui-icon layui-icon-edit"></i>
//                     </button>
//                     <button type="button" class="layui-btn deleteBtn" onclick="deleteById(${student.id})">
//                         <i class="layui-icon layui-icon-delete"></i>
//                     </button>
//                 </td>
//             </tr>`
//         tableBody.append(row)
//     })
// }
//
// /**
//  * 加载初始学生数据
//  */
// function loadStudentList() {
//     $.ajax({
//         url: '/api/student/list',
//         method: 'GET',
//         success: function (data) {
//             return data.data
//             // renderStudentTable(data)
//         },
//         error: function () {
//             alert('加载学生列表失败，请稍后重试')
//         }
//     })
// }
//
// /**
//  * 搜索学生数据
//  * @param {string} name - 学生姓名
//  */
// function searchByAjax(name) {
//     $.ajax({
//         url: '/api/student/search',
//         method: 'POST',
//         data: { name },
//         success: function (data) {
//             renderStudentTable(data)
//         },
//         error: function () {
//             alert('搜索失败，请稍后重试')
//         }
//     })
// }
//
// // 页面加载完成后绑定事件
// $(function () {
//     // loadStudentList() // 初始化加载学生数据
//
//     // Thymeleaf 重置按钮
//     $('#Thymeleaf-reset-btn').on('click', function () {
//         $('input[name="name"]').val('') // 清空表单内容
//         window.location.href = '/student/list' // 回到初始界面
//     })
//
//     // Ajax 重置按钮
//     $('#ajax-reset-btn').on('click', function () {
//         $('input[name="ajax-name"]').val('') // 清空表单内容
//         loadStudentList() // 加载初始学生数据
//     })
//
//     // Ajax 搜索按钮
//     $('#ajax-search-btn').on('click', function () {
//         const inputName = $('input[name="ajax-name"]').val().trim()
//         searchByAjax(inputName)
//     })
// })
//
// let layerIndex
//
// /**
//  * 弹出学生新增/更新对话框
//  */
// function showStuDlg(id) {
//     if(id){
//         // 编辑操作
//         // 读取学生信息并赋值
//         $.ajax({
//             url: `/api/student/${id}`,
//             method: 'GET',
//             success: function (student) {
//                 $.each(student, function (key, value) {
//                     let field = $(`#stuForm [name="${key}"]`)
//
//                     if (field.is(':radio')){
//                         field.filter(`[value="${value}"]`).prop('checked', true)
//                     }else if(field.is(':checkbox')){
//                         field.prop('checked', value === "yes")
//                     }else {
//                         field.val(value)
//                     }
//                 })
//             },
//             error: function () {
//                 alert('添加失败，请稍后重试')
//             }
//         })
//
//     }else{
//         // 新增操作
//         $('#stuForm')[0].reset()
//     }
//
//     layerIndex = layer.open({
//         type: 1,
//         title: id ? '更新学生信息' : '新增学生信息',
//         area: ['520px', 'auto'],
//         content: $('#stuForm')
//     })
// }
//
// layui.use(function () {
//     let table = layui.table
//     let inst = table.rennder({
//         elem: '#studentTb',
//         cols: [[ //标题栏
//             {field: 'id', title: 'ID', width: 80, sort: true},
//             {field: 'sno', title: '城市', width: 120},
//             {field: 'name', title: '姓名', width: 120},
//             {field: 'sex', title: '性别', width: 80},
//             {field: 'age', title: '年龄', width: 80, sort: true},
//             {field: 'password', title: '密码', width: 80},
//             {field: 'edit', title: '操作', width: 120}
//         ]],
//         data: loadStudentList(),
//         page: true,
//         limits: [5, 10, 15],
//         limit: 5
//     })
//
//     // 验证表单是否合法
//     layui.form.on('submit(stu-dlg)', function (data) {
//         event.preventDefault()
//
//         commitStuDlg()
//     })
// })
//
// function commitStuDlg() {
//     let id = $('#id').val()
//     let formData = $('#stuForm').serialize()
//     console.log(formData)
//     if(id !== null && id !== ''){
//         // 是更新学生
//         $.ajax({
//             url: '/api/student/update',
//             method: 'PUT',
//             data: formData,
//             success: function (data) {
//                 if (data.id){
//                     // 读取并刷新原来的学生列表
//                     loadStudentList()
//
//                     // 关闭弹出层
//                     if(layerIndex){
//                         layer.close(layerIndex)
//                     }
//                 }
//             },
//             error: function () {
//                 alert('更新失败，请稍后重试')
//             }
//         })
//     }else{
//         // 新增学生
//         // 将表单数据发送到服务器的insert中,把提交按钮变灰
//         $.ajax({
//             url: '/api/student/add',
//             method: 'POST',
//             data: formData,
//             success: function (data) {
//                 if (data.id){
//                     // 读取并刷新原来的学生列表
//                     loadStudentList()
//
//                     // 关闭弹出层
//                     if(layerIndex){
//                         layer.close(layerIndex)
//                     }
//                 }
//             },
//             error: function () {
//                 alert('添加失败，请稍后重试')
//             }
//         })
//     }
//
//     $("#btnOK").prop("disabled",true).addClass("layui-btn-disabled")
// }
//
// function deleteById(id) {
//     layer.confirm('是否确定要删除该学生信息？', {icon: 3}, function(){
//
//         $.ajax({
//             url: `/api/student/delete/${id}`,
//             method: 'DELETE',
//             success: function () {
//                 // 读取并刷新原来的学生列表
//                 loadStudentList()
//                 layer.closeAll()
//                 layer.msg('删除成功', {icon: 1})
//             },
//             error: function () {
//                 alert('删除失败，请稍后重试')
//             }
//         })
//     }, function(){
//         layer.msg('已取消删除')
//     })
// }
// $(function ()
// {
//     //代码
//    loadStudentList();
//
// });
//
// function loadStudentList() {
//
//     $.ajax({
//         url:"/api/student/list"
//     }).done(function (date) {
//         // console.log(date)
//         let html ="";
//         date.forEach((element,index) => {
//             html += "<tr>"
//
//             html += "<td>" + element.id + "</td>"
//             html += "<td>" + element.name + "</td>"
//             html += "<td>" + element.sex + "</td>"
//             html += "<td>" + element.age + "</td>"
//             html += "<td>" + element.sno + "</td>"
//             html += "<td>" + element.password + "</td>"
//             html += "<td>  <a href='#' onClick='showStudentDlg("+element.id+")'> 编辑</a></td>"
//             html += "</tr>"
//
//         })
//
//         $("#studentTb").html(html)
//
//     });
//
// }
//
//
// let layerIndex;
//
//
//
// /**
//  * 弹出学生信息对话框
//  */
// function showStudentDlg(id) {
//     let title = "新增学生";
//     $("#formId").css("display","block");
//
//     //新增表单
//     if (id) {
//         // 是编辑
//         title = "编辑学生";
//         // 读取学生信息并赋值
//         $.ajax({
//             url: "/api/student/" + id,
//             method: "GET"
//         }).done(function(result) {
//             console.log(result);
//             $.each(result, function(key, value) {
//                 // 修改选择器，确保选择的是 #studentForm 内的字段
//                 var field = $('#studentForm').find('[name="' + key + '"]');
//
//                 if (field.is('input:radio')) {
//                     field.filter('[value="' + value + '"]').prop('checked', true); // 选中对应的单选按钮
//                 } else if (field.is('input:checkbox')) {
//                     field.prop('checked', value === "yes"); // 选中复选框
//                 } else {
//                     field.val(value); // 填充文本框或其他字段
//                 }
//             });
//         });
//     }else {
//         $("#studentForm")[0].reset();
//         $("#formId").css("display","none");
//     }
//
//     // 打开弹窗的代码应该在 if-else 结构之外
//     layerIndex = layer.open({
//         type: 1,
//         title: title,
//         area: ['520px', 'auto'],
//         content: $('#studentForm')
//     });
// }
//
//
// //阻止全部刷新
// layui.use(function () {
//
//     //验证表单是否合法
//     layui.form.on('submit(stud-dlg)',function (data) {
//     event.preventDefault();//组织表单默认提交
//
//         commitStuDlg();
//
//     })
//
//
// })
//
//
// function commitStuDlg() {
//     let id = $("#id").val()
//     let formData = $("#studentForm").serialize();
//     if(id != null && id!=""){
//         //是更新
//         $.ajax({
//             url: "/api/student/update",
//             method: "PUT",
//             data: formData
//         }).done(function(result) {
//             console.log(result);
//             if (result.id) {
//                 // 刷新学生列表
//                 loadStudentList();
//                 console.log("add success");
//                 if (layerIndex) {
//                     layer.close(layerIndex); // 关闭弹出层
//                 }
//             }
//         }).fail(function(jqXHR, textStatus, errorThrown) {
//             console.error("Request failed: " + textStatus + "-" + errorThrown);
//             alert("An error occurred. Please try again.");
//         });
//
//     }else{
//         //把表单数据提交，更新
//
//         $.ajax({
//             url: "/api/student/add",
//             method: "POST",
//             data: formData
//         }).done(function(result) {
//             console.log(result);
//             if (result.id) {
//                 // 刷新学生列表
//                 loadStudentList();
//                 console.log("add success");
//                 if (layerIndex) {
//                     layer.close(layerIndex); // 关闭弹出层
//                 }
//             }
//         }).fail(function(jqXHR, textStatus, errorThrown) {
//             console.error("Request failed: " + textStatus + "-" + errorThrown);
//             alert("An error occurred. Please try again.");
//         });
//
//
//     }
//
//
//
//         $("#btnOK").prop("disabled", false).removeClass("layui-btn-disabled"); // 重新启用按钮
// }