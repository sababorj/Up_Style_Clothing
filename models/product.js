module_exports = function(sequelize, DataType) {
    var Product = sequelize.define( "Product", {
        Ptype: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        size: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        height: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        color: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        imgUrl: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        productUrl: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        price: {
            type: Sequelize.DECIMAL(10, 2), 
            allowNull: false 
        },
        occasion: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        gender: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        brand: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
        description : sequelize.TEXT
    })
}