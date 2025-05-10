const { findAllByTestId } = require("@testing-library/react");
const db = require("./models");

async function testModels() {
  try {
    // 同步数据库模型（创建表）
    await db.sequelize.sync({ force: false });
    console.log('数据库表创建成功');

    // 创建测试用户
    const testUser = await db.User.create({
      username: "测试用户",
      password: "123456",
      email: "test@example.com"
    });
    console.log('用户创建成功:', testUser.toJSON());

    // 创建测试帖子
    const testPost = await db.Post.create({
      title: "测试帖子",
      content: "这是一个测试帖子的内容",
      UserId: testUser.id
    });
    console.log('帖子创建成功:', testPost.toJSON());

    // 创建测试评论
    const testComment = await db.Comment.create({
      content: "这是一条测试评论",
      UserId: testUser.id,
      PostId: testPost.id
    });
    console.log('评论创建成功:', testComment.toJSON());

    // 测试关联查询
    const postWithComments = await db.Post.findOne({
      where: { id: testPost.id },
      include: [
        { model: db.User },
        { model: db.Comment, include: [db.User] }
      ]
    });
    console.log('帖子及其关联数据:', JSON.stringify(postWithComments, null, 2));

  } catch (error) {
    console.error('测试过程中出现错误:', error);
  } finally {
    // 关闭数据库连接
    await db.sequelize.close();
  }
}

testModels(); 