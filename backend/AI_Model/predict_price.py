import sys
import json
import pickle
import numpy as np
import pandas as pd
import catboost as cb
import re # Thêm thư viện re

# Đường dẫn tuyệt đối (đảm bảo đúng trên máy bạn)
MODEL_PATH = r"D:\batdongsan\RealEstate_HUCE\backend\AI_Model\catboost_model.cbm"
PICKLE_PATH = r"D:\batdongsan\RealEstate_HUCE\backend\AI_Model\preprocess_globals.pkl"

# <<<--- BƯỚC 2.1: DÁN HÀM extract_district_city_v2 VÀO ĐÂY --->>>
def extract_district_city_v2(address):
    # DÁN TOÀN BỘ NỘI DUNG HÀM TỪ NOTEBOOK CỦA BẠN VÀO ĐÂY
    # ... (code hàm rất dài, bạn tự copy nhé)
    if pd.isna(address) or not isinstance(address, str) or not address.strip():
        return 'Other', 'Other'
   
    # Làm sạch address
    addr = address.strip()
    addr = addr.rstrip('.').strip()
    addr = re.sub(r'\s*,\s*', ', ', addr)
    addr = re.sub(r'\s+', ' ', addr)
    address_lower = addr.lower()
   
    # City mapping (substring mạnh - giữ nguyên từ code của bạn)
    city_map = {
        'hồ chí minh': 'HCM', 'tp.hồ chí minh': 'HCM', 'tphcm': 'HCM', 'hcm': 'HCM',
        'tp hồ chí minh': 'HCM', 'tp. hồ chí minh': 'HCM', 'hồ chí minh.': 'HCM',
        'hà nội': 'HN', 'thành phố hà nội': 'HN', 'hn': 'HN', 'hà nội': 'HN', 'hà nội.': 'HN',
        'hưng yên': 'HY', 'hưng yên.': 'HY',
        'thái bình': 'HY',
        'bình dương': 'BD', 'bình dương.': 'BD',
        'đà nẵng': 'ĐN', 'đn': 'ĐN', 'đà nẵng.': 'ĐN',
        'long an': 'LA', 'long an.': 'LA',
        'đồng nai': 'Đồng Nai', 'đồng nai.': 'Đồng Nai',
        'bà rịa vũng tàu': 'BRVT', 'bà rịa vũng tàu.': 'BRVT',
        'quảng ninh': 'QN', 'quảng ninh.': 'QN',
        'phú thọ': 'PT', 'vĩnh phúc': 'PT', 'hòa bình': 'PT',
        'hải phòng': 'HP', 'hải dương': 'HP', 'hải phòng.': 'HP',
        'khánh hòa': 'KH', 'khánh hòa.': 'KH',
        'kiên giang': 'KG', 'kiên giang.': 'KG',
        'bình thuận': 'BT', 'bình thuận.': 'BT',
        'thanh hóa': 'TH', 'thanh hóa.': 'TH',
        'cần thơ': 'CT', 'cần thơ.': 'CT',
        # Fallback sáp nhập
        'hà giang': 'tuyên quang',
        'yên bái': 'lào cai',
        'bắc kạn': 'thái nguyên',
        'bắc giang': 'bắc ninh',
        'hà nam': 'ninh bình',
        'nam định': 'ninh bình',
    }
   
    city = 'Other'
    for k, v in city_map.items():
        if k in address_lower:
            city = v
            break
   
    if city == 'Other':
        parts = [p.strip() for p in addr.split(',') if p.strip()]
        if parts:
            last_part = parts[-1].strip()
            last_lower = last_part.lower()
            
            for k, v in city_map.items():
                if k in last_lower:
                    city = v
                    break
            
            if city == 'Other':
                city = last_part.title()
   
    district_keywords = ['quận ', 'huyện ', 'thị trấn ', 'phường ', 'xã ', 'thị xã ', 'tp.', 'thành phố ', 'tp ']
    district = 'Other'
   
    parts = [p.strip() for p in addr.split(',') if p.strip()]
   
    for part in parts:
        part_lower = part.lower()
       
        if any(kw in part_lower for kw in district_keywords):
            cleaned = re.sub(r'^(quận|huyện|thị xã|thành phố|tp\.|tp )\s+', '', part, flags=re.IGNORECASE).strip()
            district = cleaned.title()
            break
        elif any(d in part_lower for d in [
            'gò vấp', 'bình thạnh', 'quận 7', 'thủ đức', 'long biên', 'cầu giấy', 'đống đa', 'thanh xuân',
            'văn giang', 'nha trang', 'biên hòa', 'thủ dầu một', 'thuận an', 'vũng tàu', 'phan thiết', 'dĩ an', 'tân uyên'
        ]):
            district = part.title()
            break
   
    district_normalize = {
        'long biên': 'Long Biên', 'quận long biên': 'Long Biên',
        'quận tân bình': 'Tân Bình', 'tân bình': 'Tân Bình',
        'quận bình tân': 'Bình Tân', 'bình tân': 'Bình Tân',
        'huyện văn giang': 'Văn Giang', 'văn giang': 'Văn Giang',
        'thành phố nha trang': 'Nha Trang', 'nha trang': 'Nha Trang',
        'thành phố biên hòa': 'Biên Hòa', 'biên hòa': 'Biên Hòa',
        'thành phố thủ dầu một': 'Thủ Dầu Một', 'thủ dầu một': 'Thủ Dầu Một',
        'thành phố thuận an': 'Thuận An', 'thuận an': 'Thuận An',
        'thành phố tân uyên': 'Tân Uyên', 'tân uyên': 'Tân Uyên',
        'thành phố vũng tàu': 'Vũng Tàu', 'vũng tàu': 'Vũng Tàu',
        'thành phố phan thiết': 'Phan Thiết', 'phan thiết': 'Phan Thiết',
        'thành phố dĩ an': 'Dĩ An', 'dĩ an': 'Dĩ An',
        'quận 1': 'Quận 1','quận 2': 'Quận 2','quận 3': 'Quận 3',
        'quận 4': 'Quận 4','quận 5': 'Quận 5','quận 6': 'Quận 6',
        'quận 7': 'Quận 7','quận 8': 'Quận 8','quận 9': 'Quận 9',
        'quận 10': 'Quận 10','quận 11': 'Quận 11','quận 12': 'Quận 12',
    }
   
    district_lower_clean = re.sub(r'^(quận|huyện|thị xã|thành phố)\s+', '', district.lower())
    for k, v in district_normalize.items():
        if k in district_lower_clean:
            district = v
            break
   
    if district == 'Other' and 'dự án' in address_lower:
        if 'ocean park' in address_lower or 'vinhomes ocean' in address_lower:
            district = 'Văn Giang'
        elif 'grand park' in address_lower or 'vinhomes grand park' in address_lower:
            district = 'Quận 9'
   
    district = re.sub(r'^(Quận|Huyện|Thành phố|Tp\.|Thị Xã)\s+', '', district, flags=re.IGNORECASE).strip().title()
   
    return city, district
# --- Kết thúc hàm ---

PICKLE_PATH = r"D:\batdongsan\RealEstate_HUCE\backend\AI_Model\preprocess_globals.pkl"

# Load model & globals
model = cb.CatBoostRegressor()
model.load_model(MODEL_PATH)

with open(PICKLE_PATH, "rb") as f:
    globals_dict = pickle.load(f)

district_medians = globals_dict['district_medians']
district_avg = globals_dict['district_avg']
overall_avg = globals_dict['overall_avg']
overall_medians = globals_dict['overall_medians']
features = globals_dict['features']
good_dirs = globals_dict['good_dirs']
numerical_cols = globals_dict['numerical_cols']

# Load label_encoders (đã save trong notebook)
label_encoders = globals_dict.get('label_encoders', {})

def main():
    input_data = sys.stdin.read().strip()
    if not input_data:
        print(json.dumps({"error": "No input data received"}))
        sys.exit(1)

    try:
        data = json.loads(input_data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)

    # Tạo DataFrame
    df = pd.DataFrame([data])

    # <<<--- BƯỚC 2.2: GỌI HÀM XỬ LÝ ADDRESS --->>>
    # Áp dụng hàm để tạo cột 'city' và 'district' từ 'address'
    if 'address' in df.columns:
        df['city'], df['district'] = zip(*df['address'].apply(extract_district_city_v2))

    # Chỉ loại bỏ surrogate (ký tự lỗi ẩn), KHÔNG dùng unidecode
    for col in ['city', 'district', 'house_direction', 'legal_status', 'furniture_state']:
        if col in df.columns:
            df[col] = df[col].apply(
                lambda x: ''.join(c for c in str(x) if not (0xD800 <= ord(c) <= 0xDFFF)) if pd.notna(x) else 'Missing'
            )

    # Encode categorical thành số (giống lúc train)
    for col in ['city', 'district', 'house_direction', 'legal_status', 'furniture_state']:
        if col in df.columns and col in label_encoders:
            le = label_encoders[col]
            # CHUẨN HÓA DỮ LIỆU ĐẦU VÀO TRƯỚC KHI TRANSFORM
            df[col] = df[col].astype(str).fillna('Missing')
            df[col] = df[col].apply(
                lambda x: le.transform([x])[0] if x in le.classes_ else -1
            )

    # Impute numerical
    for col in numerical_cols:
        # Quan trọng: Lấy district đã được encode thành số để tra cứu
        current_district_encoded = df.at[0, 'district'] if 'district' in df.columns else -1
        if col in df.columns and pd.isna(df.at[0, col]):
            # Sử dụng overall_medians nếu không tìm thấy district_medians
            med = district_medians.get(col, {}).get(current_district_encoded, overall_medians.get(col, 0))
            df.at[0, col] = med

    # Tạo feature engineered
    df['district_avg_price_per_m2'] = df['district'].map(district_avg).fillna(overall_avg)
    df['total_rooms'] = df['bedrooms'] + df['bathrooms'] + 1
    df['bed_bath_ratio'] = df['bedrooms'] / (df['bathrooms'] + 1e-6)
    df['area_per_floor'] = df['area'] / (df['floors'] + 1e-6)
    df['rooms_per_floor'] = df['total_rooms'] / (df['floors'] + 1e-6)

    # Lấy giá trị house_direction đã được encode
    house_dir_encoded = df.at[0, 'house_direction'] if 'house_direction' in df.columns else -1
    df['is_good_direction'] = int(house_dir_encoded in good_dirs)

    df['area_x_district_avg'] = df['area'] * df['district_avg_price_per_m2']
    df['frontage_x_access'] = df['frontage'] * df['access_road']

    # Chọn features
    # Đảm bảo tất cả các feature cần thiết đều có, nếu không thì tạo cột với giá trị mặc định (vd: 0)
    X = pd.DataFrame(columns=features)
    X = pd.concat([X, df], ignore_index=True, sort=False)
    for col in features:
        if col not in X.columns:
            X[col] = 0 # Hoặc một giá trị mặc định hợp lý khác
        # Xử lý NaN sau khi concat
        if X[col].isnull().any():
            if X[col].dtype.name == 'category' or X[col].dtype == 'object':
                X[col] = X[col].fillna(-1) # -1 cho category mới
            else:
                X[col] = X[col].fillna(0) # 0 cho numeric
    
    X = X[features].copy()

    # Predict
    pred_log = model.predict(X)
    pred_price = float(np.expm1(pred_log)[0])

    print(json.dumps({
        "success": True,
        "predicted_price": pred_price
    }))
    sys.stdout.flush()

if __name__ == "__main__":
    main()