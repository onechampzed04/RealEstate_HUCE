# predict_price.py (PHIÊN BẢN CUỐI CÙNG - HỖ TRỢ FEATURE NÂNG CAO)

import sys
import json
import pickle
import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
import re
import io

# Cấu hình UTF-8 cho tất cả các luồng
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')

# =============================================================================
# SECTION 1: TẢI MODEL VÀ CÁC BIẾN TIỀN XỬ LÝ (NÂNG CAO)
# =============================================================================
try:
    MODEL_PATH = r"D:\batdongsan\RealEstate_HUCE\backend\AI_Model\catboost_model.cbm"
    PICKLE_PATH = r"D:\batdongsan\RealEstate_HUCE\backend\AI_Model\preprocess_globals.pkl"
    model = CatBoostRegressor()
    model.load_model(MODEL_PATH)
    with open(PICKLE_PATH, "rb") as f:
        globals_dict = pickle.load(f)

    # Giải nén các biến mới và cũ
    features = globals_dict['features']
    numerical_cols = globals_dict['numerical_cols']
    cat_cols = globals_dict['cat_cols']
    district_medians = globals_dict['district_medians']
    overall_medians = globals_dict['overall_medians']
    district_log_price_avg = globals_dict['district_log_price_avg'] # Mới
    global_log_price_avg = globals_dict['global_log_price_avg'] # Mới
    good_dirs = globals_dict['good_dirs']
except Exception as e:
    print(json.dumps({"success": False, "message": f"Lỗi nghiêm trọng khi tải model hoặc file pickle: {str(e)}"}))
    sys.exit(1)

# =============================================================================
# SECTION 2: HÀM TRÍCH XUẤT ĐỊA CHỈ ĐA CẤP (V5)
# =============================================================================
def extract_location_v5(address):
    # ... (Sao chép y hệt hàm extract_location_v5 từ file training)
    if pd.isna(address) or not isinstance(address, str) or not address.strip(): return 'Other', 'Other', 'Other'
    addr = address.lower().replace('.', '')
    parts = [p.strip() for p in addr.split(',')]
    city_map = {'hà nội': 'HN', 'hồ chí minh': 'HCM', 'tp hcm': 'HCM', 'tphcm': 'HCM', 'sài gòn': 'HCM', 'hải phòng': 'HP', 'đà nẵng': 'ĐN', 'cần thơ': 'CT', 'bình dương': 'BD', 'đồng nai': 'Đồng Nai', 'bà rịa vũng tàu': 'BRVT', 'khánh hòa': 'KH', 'long an': 'LA', 'hưng yên': 'HY', 'an giang': 'An Giang', 'bắc giang': 'Bắc Giang', 'bắc kạn': 'Bắc Kạn', 'bạc liêu': 'Bạc Liêu', 'bắc ninh': 'Bắc Ninh', 'bến tre': 'Bến Tre', 'bình định': 'Bình Định', 'bình phước': 'Bình Phước', 'bình thuận': 'Bình Thuận', 'cà mau': 'Cà Mau', 'cao bằng': 'Cao Bằng', 'đắk lắk': 'Đắk Lắk', 'đắk nông': 'Đắk Nông', 'điện biên': 'Điện Biên', 'gia lai': 'Gia Lai', 'hà giang': 'Hà Giang', 'hà nam': 'Hà Nam', 'hà tĩnh': 'Hà Tĩnh', 'hải dương': 'Hải Dương', 'hậu giang': 'Hậu Giang', 'hòa bình': 'Hòa Bình', 'kiên giang': 'Kiên Giang', 'kon tum': 'Kon Tum', 'lai châu': 'Lai Châu', 'lâm đồng': 'Lâm Đồng', 'lạng sơn': 'Lạng Sơn', 'lào cai': 'Lào Cai', 'nam định': 'Nam Định', 'nghệ an': 'Nghệ An', 'ninh bình': 'Ninh Bình', 'ninh thuận': 'Ninh Thuận', 'phú thọ': 'Phú Thọ', 'phú yên': 'Phú Yên', 'quảng bình': 'Quảng Bình', 'quảng nam': 'Quảng Nam', 'quảng ngãi': 'Quảng Ngãi', 'quảng ninh': 'Quảng Ninh', 'quảng trị': 'Quảng Trị', 'sóc trăng': 'Sóc Trăng', 'sơn la': 'Sơn La', 'tây ninh': 'Tây Ninh', 'thái bình': 'Thái Bình', 'thái nguyên': 'Thái Nguyên', 'thanh hóa': 'Thanh Hóa', 'thừa thiên huế': 'Thừa Thiên Huế', 'huế': 'Thừa Thiên Huế', 'tiền giang': 'Tiền Giang', 'trà vinh': 'Trà Vinh', 'tuyên quang': 'Tuyên Quang', 'vĩnh long': 'Vĩnh Long', 'vĩnh phúc': 'Vĩnh Phúc', 'yên bái': 'Yên Bái'}
    found_city, found_district, found_sub_district = 'Other', 'Other', 'Other'
    district_keywords, sub_district_keywords = ['quận', 'huyện', 'thị xã', 'thành phố', 'tp'], ['phường', 'xã', 'thị trấn']
    for part in reversed(parts):
        if any(kw in part for kw in sub_district_keywords) and found_sub_district == 'Other':
            for kw in sub_district_keywords: part = part.replace(kw, '').strip()
            found_sub_district = part.title()
        elif any(kw in part for kw in district_keywords) and found_district == 'Other':
             if not any(city_name in part for city_name in ['hà nội', 'hồ chí minh', 'hải phòng', 'đà nẵng', 'cần thơ']):
                for kw in district_keywords: part = part.replace(kw, '').strip()
                found_district = part.title()
        if found_city == 'Other':
            for name, code in city_map.items():
                if name in part: found_city = code; break
    return found_city, found_district, found_sub_district

# =============================================================================
# SECTION 3: HÀM MAIN (PHIÊN BẢN NÂNG CAO)
# =============================================================================
def main():
    try:
        input_data = json.loads(sys.stdin.read())
        df = pd.DataFrame([input_data])
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()
        
        # 1. Trích xuất địa chỉ đa cấp
        if 'address' in df.columns:
            df['city'], df['district'], df['sub_district'] = zip(*df['address'].apply(extract_location_v5))
            df = df.drop(columns=['address'])

        # 2. Impute và fillna
        for col in numerical_cols:
            df[col] = pd.to_numeric(df.get(col, np.nan), errors='coerce')
            if pd.isna(df.at[0, col]):
                district_name = df.at[0, 'district']
                df.at[0, col] = district_medians[col].get(district_name, overall_medians[col])
        for col in cat_cols:
             if col in df.columns:
                df[col] = df[col].fillna('Khác').astype(str)

        # 3. Feature Engineering Nâng Cao (y hệt file training)
        df['area_squared'] = df.get('area', 0).fillna(0)**2
        district_name = df.at[0, 'district']
        df['district_price_modifier'] = district_log_price_avg.get(district_name, global_log_price_avg)
        df['area_x_price_modifier'] = df.get('area', 0).fillna(0) * df['district_price_modifier']
        df['total_rooms'] = df.get('bedrooms', 0).fillna(0) + df.get('bathrooms', 0).fillna(0) + 1
        df['rooms_per_area'] = df['total_rooms'] / (df.get('area', 1).fillna(1) + 1e-6)
        df['is_good_direction'] = df.get('house_direction', '').isin(good_dirs).astype(int)

        # 4. Chuẩn bị dữ liệu cuối cùng
        for col in features:
            if col not in df.columns:
                df[col] = 0
        X = df[features]
        
        # 5. Dự đoán
        pred_log = model.predict(X)
        pred_price = float(np.expm1(pred_log)[0])

        print(json.dumps({"success": True, "predicted_price": pred_price}))
        sys.stdout.flush()

    except Exception as e:
        print(json.dumps({"success": False, "message": f"Lỗi trong kịch bản Python: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()