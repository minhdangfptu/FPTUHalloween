const bcrypt = require('bcrypt')
const { User, Role } = require('../models')

const SOURCE_STT = 'Danh sách BTC · STT 1–18'

const users = [
  ['Nguyễn Thảo Vy', 'TBTC', 'HE186340', '0338263886', 'ntvy04@gmail.com'],
  ['Nguyễn Thị Phương Thảo', 'HR', 'HS204344', '0366096220', 'ntpt2056@gmail.com'],
  ['Nguyễn Hà Phương', 'Sublead Nhà Ma', 'HS210890', '0946300907', 'nguyenhaphuogn3009@gmail.com'],
  ['Trương Bá Hoàng', 'Sublead Nhà Ma', 'HE181845', '0359399897', 'hoangtb020304@gmail.com'],
  ['Lê Thị Thùy', 'Lead Truyền Thông', 'HS194077', '0947319889', 'lethithuy15072005@gmail.com'],
  ['Phùng Thị Thanh Thủy', 'SubLead Truyền Thông', 'HS211039', '0339299967', 'phungthithanhthuy30102007@gmail.com'],
  ['Nguyễn Hương Ly', 'Lead Nội Dung', 'HS200185', '0984264697', 'huongly30102006@gmail.com'],
  ['Nguyễn Tạ Đăng Duy', 'Sublead Nội Dung', 'HS200498', '0964291728', 'nguyentadangduy24122006@gmail.com'],
  ['Nguyễn Việt Trung', 'Lead Hậu Cần', 'HE204795', '0358670218', 'ngvietrung0803@gmail.com'],
  ['Nguyễn Huy Phước', 'Sublead Hậu Cần', 'HE181151', '0385949616', 'huyphuoc204@gmail.com'],
  ['Nga Nguyễn', 'Sublead Hậu Cần', 'HE190514', '0901056140', 'nguyenlinhnga2005@gmail.com'],
  ['Bùi Mai Chi', 'Lead Takcare', 'HE194598', '0348677246', 'chi141005gmail.com'],
  ['Trịnh Hiền', 'Sublead Takecare', 'HE190887', '0356270914', 'trinhhien0702@gmail.com'],
  ['Đặng Đình Minh', 'Lead Media', 'HE180032', '0398826650', 'minhdangdinh261004@gmail.com'],
  ['Hoàng Khánh Chi', 'Lead Design', 'HE194890', '0868245896', 'khanhchidb2005@gmail.com'],
  ['Khuất Kim Bảo', 'Sublead Design', 'HE180441', '0888572004', 'kimbao20040@gmail.com'],
  ['Nguyễn Thế Dương', 'Sublead Design', 'HE182265', '0813036848', 'nguyentheduong3110@gmail.com'],
]

const incompleteRows = [
  { stt: 3, fullName: 'Trần Quang Anh', reason: 'missing MSSV, phone and email' },
  { stt: 6, fullName: 'Xuân Quỳnh', reason: 'missing MSSV, phone and email' },
]

const removeVietnameseMarks = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
const createUserName = (fullName, usedNames) => {
  const words = removeVietnameseMarks(fullName).toLowerCase().trim().split(/\s+/)
  const base = `${words[words.length - 1]}${words.slice(0, -1).map(word => word[0]).join('')}`
  let userName = base
  let suffix = 1
  while (usedNames.has(userName)) userName = `${base}${suffix++}`
  usedNames.add(userName)
  return userName
}

const parsePosition = (jobTitle) => {
  const [position, ...departmentParts] = jobTitle.trim().split(/\s+/)
  return { department_position: position, department: departmentParts.join(' ') || null }
}

const seedFbgcUsers = async () => {
  const role = await Role.findOne({ roleName: 'User', roleActive: true })
  if (!role) throw new Error('Default User role not found')

  const seedEmails = users.map(([, , , , email]) => email)
  const usedNames = new Set(await User.distinct('userName', { email: { $nin: seedEmails }, userName: { $exists: true, $ne: null } }))
  const seededUsers = []
  for (const [fullName, jobTitle, mssv, phone, email] of users) {
    const userName = createUserName(fullName, usedNames)
    const { department_position, department } = parsePosition(jobTitle)
    const password = await bcrypt.hash(`${mssv}${phone}`, 10)
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { userName, fullName, phone, department, department_position, authProvider: 'local', roleId: role._id, isVerified: true, isDisabled: false, password } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    )
    seededUsers.push({ userName: user.userName, email: user.email })
  }

  console.warn(`[${SOURCE_STT}] Skipped incomplete rows:`, incompleteRows)
  console.log(`Seeded ${seededUsers.length} FBGC users.`)
  return seededUsers
}

module.exports = { seedFbgcUsers, users, incompleteRows }
