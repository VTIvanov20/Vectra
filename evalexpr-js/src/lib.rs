// use evalexpr::*;
// use std::io::BufRead;

use std::f64::consts::PI;

use wasm_bindgen::prelude::*;
use evalexpr::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn info(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn debug(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn warn(s: &str);

    #[wasm_bindgen(js_namespace = console)]
    fn clear();
}

fn jsvalue_to_value(js_val: &JsValue) -> Value {
    if let Some(v) = js_val.as_f64() { Value::Float(v) }
    else if let Some(v) = js_val.as_string() { Value::String(v) }
    else if let Some(v) = js_val.as_bool() { Value::Boolean(v) }
    else if js_val.is_object() {
        let v = js_sys::Array::from(js_val)
            .iter()
            .map(|el| jsvalue_to_value(&el))
            .collect::<Vec<Value>>();
        Value::Tuple(v)
    }
    else { Value::Empty }
}

fn value_to_jsvalue(val: &Value) -> JsValue {
    match val {
        Value::String(v) => JsValue::from_str(&v),
        Value::Float(v) => JsValue::from_f64(*v),
        Value::Int(v) => JsValue::from_f64(*v as f64),
        Value::Boolean(v) => JsValue::from_bool(*v),
        Value::Tuple(v) => {
            v
                .iter()
                .map(|el| value_to_jsvalue(el))
                .collect::<js_sys::Array>()
                .into()
        },
        Value::Empty => JsValue::null()
    }
}

#[wasm_bindgen]
pub struct JsEvalexprContext {
    context: HashMapContext,
}

#[wasm_bindgen]
impl JsEvalexprContext {
    #[wasm_bindgen(constructor)]
    pub fn new() -> JsEvalexprContext {
        let map = context_map! {
            "pi" => Value::Float(PI),
            "abs" => Function::new(|x| {
                match x {
                    Value::String(v) => Err(EvalexprError::expected_number(v.clone().into())),
                    Value::Float(v) => Ok(Value::Float(f64::abs(*v))),
                    Value::Int(v) => Ok(Value::Int(i64::abs(*v))),
                    Value::Boolean(v) => Err(EvalexprError::expected_number((*v).into())),
                    Value::Tuple(v) => Err(EvalexprError::expected_number(v.clone().into())),
                    Value::Empty => Err(EvalexprError::expected_number(Value::Empty))
                }
            })
        };

        if let Ok(map) = map { JsEvalexprContext { context: map } }
        else { JsEvalexprContext { context: HashMapContext::new() } }
    }

    pub fn eval(&mut self, line: String) -> JsValue {
        match eval_with_context_mut(&line, &mut self.context) {
            Ok(val) => value_to_jsvalue(&val),
            Err(err) => {
                error(&format!("[evalexpr.rs] [error] {}", err));
                JsValue::null()
            }
        }
    }

    pub fn set_value(&mut self, id: &str, v: &JsValue) {
        let eval_v = jsvalue_to_value(v);
        match self.context.set_value(id.to_owned(), eval_v) {
            Ok(()) => {},
            Err(e) => { error(&format!("[evalexpr.rs] [error] couldn't set value {}, reason: {}", id, e.to_string())) }
        }
    }

    pub fn get_value(&self, id: &str) -> JsValue {
        match self.context.get_value(id) {
            Some(v) => { return value_to_jsvalue(&v) },
            None => { JsValue::null() }
        }
    }
}

#[cfg(tests)]
mod tests {
    #[test]
    fn eval_one() {

    }
}