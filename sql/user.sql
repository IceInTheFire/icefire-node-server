/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50644
 Source Host           : localhost:3306
 Source Schema         : timotest

 Target Server Type    : MySQL
 Target Server Version : 50644
 File Encoding         : 65001

 Date: 05/07/2019 16:55:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `name` varchar(100) DEFAULT NULL,
  `id` int(10) NOT NULL,
  `age` int(10) DEFAULT NULL,
  `sex` int(10) DEFAULT NULL COMMENT '1为男，2为女',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('冰火', 0, 25, 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
