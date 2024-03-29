 /**
 * @jest-environment jsdom
 */
 import moment from "moment"
 import { canDropPBI, canDropTask, disabledDate, isArrayValid, isBranchNotCreated, isMessageValid, isNameFilterValid, validateString } from "../components/utility/commonFunctions"
import { initTask } from "../appstate/stateInitValues";
 
 test('can drop pbi', () => {
     expect(canDropPBI(11,12,13)).toBe(true);
 })
 
 test('cannot drop pbi', () => {
   expect(canDropPBI(-2,-2,-2)).toBe(false)
 })
 
 test('can drop task', () => {
   expect(canDropTask(11,12,13)).toBe(true)
 })
 
 test('cannot drop task', () => {
 expect(canDropTask(-2,-2,-2)).toBe(false)
 })
 
 test('name filter is valid', () => {
   expect(isNameFilterValid("name")).toBe(true)
 })
 
 test('name filter is invalid', () => {
 expect(isNameFilterValid("")).toBe(false)
 })
 
 test('message is valid', () => {
   expect(isMessageValid("name")).toBe(true)
 })
 
 test('message is invalid', () => {
 expect(isMessageValid("")).toBe(false)
 })
 
 test('can create a branch', () => {
   expect(isBranchNotCreated("New")).toBe(true)
 })
 
 test('cannot create a branch', () => {
 expect(isBranchNotCreated("InReview")).toBe(false)
 })
 
 test('array is valid', () => {
   expect(isArrayValid([initTask])).toBe(true)
 })
 
 test('array is invalid', () => {
 expect(isArrayValid([])).toBe(false)
 })
 
 test('string is valid', () => {
   expect(validateString("string")).toBe("string")
 })
 
 test('string is invalid', () => {
 expect(validateString("")).toBe("")
 })
 
 test('date is valid', () => {
   expect(disabledDate(moment().endOf('day').subtract(2, 'days'))).toBe(true)
 })
 
 test('date is invalid', () => {
 expect(disabledDate(new Date())).toBe(false)
 })
 
 
 