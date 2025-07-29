/**
 * 表单相关组合式函数
 */

import { computed, reactive, ref, watch } from 'vue'
import type { FormRule, FormRules, ValidateStatus } from '../types'

/**
 * 表单字段状态
 */
export interface FormFieldState {
  value: any
  error: string
  status: ValidateStatus
  touched: boolean
  dirty: boolean
}

/**
 * 表单状态
 */
export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  dirty: Record<string, boolean>
  valid: boolean
  submitting: boolean
}

/**
 * 使用表单钩子
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  rules?: FormRules,
) {
  // 表单值
  const values = reactive<T>({ ...initialValues })

  // 表单状态
  const errors = reactive<Record<string, string>>({})
  const touched = reactive<Record<string, boolean>>({})
  const dirty = reactive<Record<string, boolean>>({})
  const submitting = ref(false)

  // 计算属性
  const valid = computed(() => {
    return Object.keys(errors).length === 0
  })

  const formState = computed<FormState>(() => ({
    values,
    errors,
    touched,
    dirty,
    valid: valid.value,
    submitting: submitting.value,
  }))

  // 验证单个字段
  const validateField = async (name: string): Promise<boolean> => {
    const rule = rules?.[name]
    if (!rule)
return true

    const value = values[name]
    const fieldRules = Array.isArray(rule) ? rule : [rule]

    for (const fieldRule of fieldRules) {
      const result = await validateRule(value, fieldRule)
      if (result !== true) {
        errors[name] = result
        return false
      }
    }

    delete errors[name]
    return true
  }

  // 验证规则
  const validateRule = async (value: any, rule: FormRule): Promise<string | true> => {
    // 必填验证
    if (rule.required && (value === undefined || value === null || value === '')) {
      return rule.message || '此字段为必填项'
    }

    // 自定义验证器
    if (rule.validator) {
      try {
        const result = await rule.validator(value)
        if (result === true) {
          return true
        }
        return typeof result === 'string' ? result : (rule.message || '验证失败')
      }
 catch (error) {
        return rule.message || '验证失败'
      }
    }

    return true
  }

  // 验证所有字段
  const validate = async (): Promise<boolean> => {
    if (!rules)
return true

    const validationPromises = Object.keys(rules).map(name => validateField(name))
    const results = await Promise.all(validationPromises)

    return results.every(result => result)
  }

  // 设置字段值
  const setFieldValue = (name: string, value: any) => {
    values[name] = value
    dirty[name] = true

    // 如果字段已经被触摸过，立即验证
    if (touched[name]) {
      validateField(name)
    }
  }

  // 设置字段错误
  const setFieldError = (name: string, error: string) => {
    errors[name] = error
  }

  // 清除字段错误
  const clearFieldError = (name: string) => {
    delete errors[name]
  }

  // 触摸字段
  const touchField = (name: string) => {
    touched[name] = true
  }

  // 重置表单
  const reset = () => {
    Object.assign(values, initialValues)
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
    Object.keys(dirty).forEach(key => delete dirty[key])
    submitting.value = false
  }

  // 提交表单
  const submit = async (onSubmit: (values: T) => Promise<void> | void) => {
    submitting.value = true

    try {
      const isValid = await validate()
      if (isValid) {
        await onSubmit(values)
      }
    }
 finally {
      submitting.value = false
    }
  }

  // 监听值变化
  watch(
    () => values,
    () => {
      // 标记所有字段为已修改
      Object.keys(values).forEach((key) => {
        if (values[key] !== initialValues[key]) {
          dirty[key] = true
        }
      })
    },
    { deep: true },
  )

  return {
    values,
    errors,
    touched,
    dirty,
    valid,
    submitting,
    formState,
    validateField,
    validate,
    setFieldValue,
    setFieldError,
    clearFieldError,
    touchField,
    reset,
    submit,
  }
}

/**
 * 使用表单字段钩子
 */
export function useFormField(
  name: string,
  form?: ReturnType<typeof useForm>,
) {
  const value = computed({
    get: () => form?.values[name],
    set: val => form?.setFieldValue(name, val),
  })

  const error = computed(() => form?.errors[name])
  const touched = computed(() => form?.touched[name])
  const dirty = computed(() => form?.dirty[name])

  const status = computed<ValidateStatus>(() => {
    if (error.value)
return 'error'
    if (touched.value && !error.value)
return 'success'
    return 'validating'
  })

  const fieldState = computed<FormFieldState>(() => ({
    value: value.value,
    error: error.value || '',
    status: status.value,
    touched: touched.value || false,
    dirty: dirty.value || false,
  }))

  const onBlur = () => {
    form?.touchField(name)
    form?.validateField(name)
  }

  const onChange = (val: any) => {
    form?.setFieldValue(name, val)
  }

  return {
    value,
    error,
    touched,
    dirty,
    status,
    fieldState,
    onBlur,
    onChange,
  }
}

/**
 * 常用验证规则
 */
export const validators = {
  required: (message = '此字段为必填项'): FormRule => ({
    required: true,
    message,
  }),

  email: (message = '请输入有效的邮箱地址'): FormRule => ({
    validator: (value: string) => {
      if (!value)
return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) || message
    },
  }),

  minLength: (min: number, message?: string): FormRule => ({
    validator: (value: string) => {
      if (!value)
return true
      return value.length >= min || message || `最少输入${min}个字符`
    },
  }),

  maxLength: (max: number, message?: string): FormRule => ({
    validator: (value: string) => {
      if (!value)
return true
      return value.length <= max || message || `最多输入${max}个字符`
    },
  }),

  pattern: (regex: RegExp, message = '格式不正确'): FormRule => ({
    validator: (value: string) => {
      if (!value)
return true
      return regex.test(value) || message
    },
  }),

  number: (message = '请输入有效的数字'): FormRule => ({
    validator: (value: any) => {
      if (value === '' || value === null || value === undefined)
return true
      return !isNaN(Number(value)) || message
    },
  }),

  min: (min: number, message?: string): FormRule => ({
    validator: (value: number) => {
      if (value === null || value === undefined)
return true
      return value >= min || message || `值不能小于${min}`
    },
  }),

  max: (max: number, message?: string): FormRule => ({
    validator: (value: number) => {
      if (value === null || value === undefined)
return true
      return value <= max || message || `值不能大于${max}`
    },
  }),
}
