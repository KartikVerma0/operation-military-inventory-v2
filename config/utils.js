const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

module.exports = { express, path, session, flash, methodOverride, mongoose, MongoStore, passport, LocalStrategy };