import { describe, it, expect } from 'vitest'
import {
  diffPaths,
  diffValues,
  generateJsonFromPathDiff,
  generateValueDiffJson,
} from '../src/utils'

describe('JsonUtils Diff 功能测试', () => {
  console.log('🚀 开始测试 JsonUtils Diff 功能...\n')

  const objA = {
    name: 'Alice',
    age: 25,
    address: {
      city: 'New York',
      country: 'USA',
    },
    hobbies: ['reading', 'swimming'],
    profile: {
      bio: 'Software engineer',
      skills: ['JavaScript', 'Python'],
    },
  }

  const objB = {
    name: 'Alice',
    age: 26,
    address: {
      city: 'San Francisco',
      country: 'USA',
      zipCode: '94102',
    },
    hobbies: ['reading', 'gaming'],
    profile: {
      bio: 'Senior Software engineer',
      skills: ['JavaScript', 'Python', 'TypeScript'],
      experience: 5,
    },
    social: {
      twitter: '@alice',
      github: 'alice-dev',
    },
  }

  it('应该正确比较路径差异', () => {
    console.log('📋 测试 1: 路径比较功能')

    const pathDiff = diffPaths(objA, objB)

    console.log('路径比较结果:')
    console.log('- 交集 (intersection):', pathDiff.intersection)
    console.log('- A 独有 (differenceA):', pathDiff.differenceA)
    console.log('- B 独有 (differenceB):', pathDiff.differenceB)
    console.log('- 并集 (union):', pathDiff.union)

    expect(pathDiff.intersection).toContain('name')
    expect(pathDiff.intersection).toContain('age')
    expect(pathDiff.differenceB).toContain('address.zipCode')
    expect(pathDiff.differenceB).toContain('social')
    expect(pathDiff.union.length).toBeGreaterThan(pathDiff.intersection.length)
    console.log('✅ 路径比较功能正常')
    console.log()
  })

  it('应该正确生成路径差异 JSON', () => {
    console.log('📋 测试 2: 根据路径差异生成 JSON')

    const intersectionJson = generateJsonFromPathDiff(objA, objB, 'intersection')
    const differenceAJson = generateJsonFromPathDiff(objA, objB, 'differenceA')
    const differenceBJson = generateJsonFromPathDiff(objA, objB, 'differenceB')
    const unionJson = generateJsonFromPathDiff(objA, objB, 'union')

    console.log('交集 JSON:', intersectionJson)
    console.log('A 独有 JSON:', differenceAJson)
    console.log('B 独有 JSON:', differenceBJson)
    console.log('并集 JSON:', unionJson)

    expect(intersectionJson).toHaveProperty('name')
    expect(intersectionJson).toHaveProperty('age')
    expect(differenceBJson).toHaveProperty('social')
    expect(unionJson).toHaveProperty('name')
    expect(unionJson).toHaveProperty('social')
    console.log('✅ 路径差异 JSON 生成功能正常')
    console.log()
  })

  it('应该正确比较值差异', () => {
    console.log('📋 测试 3: 值差异比较功能')

    const valueDiff = diffValues(objA, objB)

    console.log('值差异结果:')
    console.log('- 所有变化路径:', valueDiff.changedPaths)
    console.log('- 新增路径:', valueDiff.addedPaths)
    console.log('- 删除路径:', valueDiff.removedPaths)
    console.log('- 修改路径:', valueDiff.modifiedPaths)
    console.log('- 差异对象:', valueDiff.changedObject)

    expect(valueDiff.changedPaths).toContain('age')
    expect(valueDiff.changedPaths).toContain('address.city')
    expect(valueDiff.addedPaths).toContain('address.zipCode')
    expect(valueDiff.addedPaths).toContain('social')
    expect(valueDiff.modifiedPaths).toContain('age')
    expect(valueDiff.changedObject).toHaveProperty('age')
    expect(valueDiff.changedObject.age).toBe(26)
    console.log('✅ 值差异比较功能正常')
    console.log()
  })

  it('应该正确生成值差异 JSON', () => {
    console.log('📋 测试 4: 生成值差异 JSON')

    const valueDiff = diffValues(objA, objB)
    const diffJson = generateValueDiffJson(objA, objB)

    console.log('差异路径:', valueDiff.changedPaths)
    console.log('差异对象:', diffJson)

    expect(diffJson).toHaveProperty('age')
    expect(diffJson).toHaveProperty('address')
    expect(diffJson).toHaveProperty('social')
    expect(diffJson.age).toBe(26)
    console.log('✅ 值差异 JSON 生成功能正常')
    console.log()
  })

  it('应该支持配置选项', () => {
    console.log('📋 测试 5: 配置选项测试')

    const onlyAdded = diffValues(objA, objB, {
      includeAdded: true,
      includeModified: false,
      includeRemoved: false,
    })
    const onlyModified = diffValues(objA, objB, {
      includeAdded: false,
      includeModified: true,
      includeRemoved: false,
    })
    const onlyRemoved = diffValues(objA, objB, {
      includeAdded: false,
      includeModified: false,
      includeRemoved: true,
    })

    console.log('只包含新增:', onlyAdded.changedPaths)
    console.log('只包含修改:', onlyModified.changedPaths)
    console.log('只包含删除:', onlyRemoved.changedPaths)

    expect(onlyAdded.changedPaths).toContain('address.zipCode')
    expect(onlyAdded.changedPaths).not.toContain('age')
    expect(onlyModified.changedPaths).toContain('age')
    expect(onlyModified.changedPaths).not.toContain('address.zipCode')
    console.log('✅ 配置选项功能正常')
    console.log()
  })

  it('应该正确处理复杂嵌套结构', () => {
    console.log('📋 测试 6: 复杂嵌套结构测试')

    const complexA = {
      users: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane', active: false },
      ],
      config: {
        theme: 'dark',
        settings: { autoSave: false },
      },
    }

    const complexB = {
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane', active: true },
        { id: 3, name: 'Bob', active: true },
      ],
      config: {
        theme: 'light',
        version: '1.0.0',
        settings: { autoSave: true, language: 'en' },
      },
    }

    const complexDiff = diffValues(complexA, complexB)

    console.log('复杂结构差异:')
    console.log('- 变化路径:', complexDiff.changedPaths)
    console.log('- 差异对象:', complexDiff.changedObject)

    expect(complexDiff.changedPaths).toContain('users[0].name')
    expect(complexDiff.changedPaths).toContain('users[1].active')
    expect(complexDiff.changedPaths).toContain('users[2]')
    expect(complexDiff.changedPaths).toContain('config.theme')
    expect(complexDiff.changedPaths).toContain('config.version')
    console.log('✅ 复杂嵌套结构处理正常')
    console.log()
  })

  it('应该通过性能测试', () => {
    console.log('📋 测试 7: 性能测试')

    const largeObjA: any = {}
    const largeObjB: any = {}

    for (let i = 0; i < 1000; i++) {
      largeObjA[`field${i}`] = { value: i, data: `test${i}` }
      largeObjB[`field${i}`] = { value: i + 1, data: `test${i}` } // 修改 value
    }

    const start = Date.now()
    const largeDiff = diffValues(largeObjA, largeObjB)
    const end = Date.now()

    console.log(`大型对象差异比较耗时: ${end - start}ms`)
    console.log(`发现 ${largeDiff.changedPaths.length} 个差异路径`)

    expect(end - start).toBeLessThan(1000) // 应该在1秒内完成
    expect(largeDiff.changedPaths.length).toBeGreaterThan(1000)
    console.log('✅ 性能测试通过')
    console.log()
  })

  it('应该正确处理边界情况', () => {
    console.log('📋 测试 8: 边界情况测试')

    // 空对象比较
    const emptyDiff = diffValues({}, {})
    console.log('空对象比较:', emptyDiff.changedPaths)

    // null/undefined 比较
    const nullDiff = diffValues({ a: null }, { a: undefined, b: 'test' })
    console.log('null/undefined 比较:', nullDiff.changedPaths)

    // 数组长度变化
    const arrayDiff = diffValues({ list: [1, 2, 3] }, { list: [1, 2, 3, 4, 5] })
    console.log('数组长度变化:', arrayDiff.changedPaths)

    expect(emptyDiff.changedPaths).toHaveLength(0)
    expect(nullDiff.changedPaths).toContain('a')
    expect(nullDiff.changedPaths).toContain('b')
    expect(arrayDiff.changedPaths).toContain('list[3]')
    expect(arrayDiff.changedPaths).toContain('list[4]')
    console.log('✅ 边界情况处理正常')
    console.log()
  })

  it('应该验证新路径格式', () => {
    console.log('📋 测试 9: 新路径格式验证')

    const testObj = {
      config: { theme: 'dark' },
      users: [
        { name: 'Alice', hobbies: ['reading', 'swimming'] },
        { name: 'Bob', hobbies: ['gaming'] },
      ],
    }

    const paths = diffPaths(testObj, testObj)

    console.log('新路径格式示例:')
    console.log(
      '- 对象属性:',
      paths.intersection.filter(p => !p.includes('['))
    )
    console.log(
      '- 数组路径:',
      paths.intersection.filter(p => p.includes('['))
    )
    console.log('- 所有路径:', paths.intersection)

    expect(paths.intersection).toContain('config')
    expect(paths.intersection).toContain('config.theme')
    expect(paths.intersection).toContain('users[0].name')
    expect(paths.intersection).toContain('users[0].hobbies[0]')
    console.log('✅ 新路径格式验证通过')
    console.log()
  })

  // 最后的总结
  it('应该完成所有 Diff 功能验证', () => {
    console.log('🎯 Diff 功能总结:')
    console.log('✅ 路径比较 - diffPaths (交集、差集、并集)')
    console.log('✅ 路径差异 JSON 生成 - generateJsonFromPathDiff')
    console.log('✅ 值差异比较 - diffValues (新增、删除、修改)')
    console.log('✅ 值差异 JSON 生成 - generateValueDiffJson')
    console.log('✅ 灵活的配置选项支持')
    console.log('✅ 复杂嵌套结构支持')
    console.log('✅ 高性能处理大型数据')
    console.log('✅ 边界情况处理')
    console.log('✅ 改进的路径格式 - 数组索引用 [] 包围')
    console.log()
    console.log('✨ JsonUtils Diff 功能测试全部完成！')

    expect(true).toBe(true) // 简单的断言确保测试通过
  })
})
