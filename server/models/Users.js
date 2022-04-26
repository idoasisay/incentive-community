const Sequelize = require("sequelize");

// 클래스를 사용해서 모델 만들기
module.exports = class Users extends Sequelize.Model {
  // init 메서드로 테이블 설정하기
  static init(sequelize) {
    // super는 상속받는 부모 클래스를 말한다. === Sequelize.Model
    return super.init(
      {
        // 첫번째 인수는 테이블 컬럼을 의미한다 = 속성
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        userName: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(255), // 음수 X
          allowNull: false,
        },
        privateKey: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      // 두번째 인수는 테이블 자체에 대한 설정을 의미한다.
      {
        sequelize,
        timestamps: true, // 자동으로 createdAt과 updatedAt 속성 추가
        charset: "utf8",
        collate: "utf8_general_ci",
        modelName: "users",
        tableName: "Users",
        paranoid: true, // 삭제시, 바로 삭제가 아닌 삭제
      }
    );
  }
};
