# predict_price.py (PHIÊN BẢN CUỐI CÙNG - Hỗ trợ sáp nhập & tăng trưởng)

import sys
import json
import pickle
import numpy as np
import pandas as pd
import re
import io
import datetime
import os

from catboost import CatBoostRegressor
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
sys.stdin = io.TextIOWrapper(sys.stdin.buffer, encoding='utf-8')

MARKET_GROWTH_FACTOR = 1.12 
STATE_FILE = os.path.join(os.path.dirname(__file__), 'market_growth_state.json')

# Biến ghi thời gian hiện tại khi script chạy
CURRENT_DATE = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S +07:00")

def load_growth_state():
    """Đọc trạng thái từ file JSON, nếu không có thì khởi tạo mặc định."""
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                state = json.load(f)
                return (
                    state.get('last_update', '2000-01-01'),
                    state.get('growth_factor', MARKET_GROWTH_FACTOR)
                )
        except:
            pass  # Nếu file hỏng, reset về mặc định
    return '2000-01-01', MARKET_GROWTH_FACTOR

def save_growth_state(last_update, growth_factor):
    """Lưu trạng thái mới vào file JSON."""
    state = {
        'last_update': last_update,
        'growth_factor': growth_factor
    }
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=4)

# Tải trạng thái cũ và kiểm tra cập nhật hàng tuần
last_update_str, current_factor = load_growth_state()
try:
    last_update_date = datetime.datetime.strptime(last_update_str, "%Y-%m-%d")
    today = datetime.date.today()
    days_diff = (today - last_update_date.date()).days

    if days_diff >= 7:
        # Cập nhật: tăng 0.0002 mỗi tuần (khoảng 0.02%/tuần)
        weeks_passed = days_diff // 7
        increment = 0.0002 * weeks_passed
        current_factor += increment
        # Làm tròn 6 chữ số thập phân cho sạch
        current_factor = round(current_factor, 6)
        # Cập nhật ngày mới (dùng ngày hôm nay)
        new_last_update = today.strftime("%Y-%m-%d")
        save_growth_state(new_last_update, current_factor)
except Exception as e:
    # Nếu lỗi parse ngày, giữ nguyên factor cũ và dùng ngày hôm nay
    current_factor = MARKET_GROWTH_FACTOR
    save_growth_state(datetime.date.today().strftime("%Y-%m-%d"), current_factor)

# Sử dụng factor đã cập nhật
MARKET_GROWTH_FACTOR = current_factor

# =============================================================================
# SECTION 1: TẢI MODEL VÀ CÁC BIẾN TIỀN XỬ LÝ (NÂNG CAO)
# =============================================================================pip install catboost
try:
    BASE_DIR = os.path.dirname(__file__)
    MODEL_PATH = os.path.join(BASE_DIR, 'catboost_model.cbm')
    PICKLE_PATH = os.path.join(BASE_DIR, 'preprocess_globals.pkl')
    model = CatBoostRegressor()
    model.load_model(MODEL_PATH)
    with open(PICKLE_PATH, "rb") as f:
        globals_dict = pickle.load(f)

    features = globals_dict['features']
    numerical_cols = globals_dict['numerical_cols']
    cat_cols = globals_dict['cat_cols']
    district_medians = globals_dict['district_medians']
    overall_medians = globals_dict['overall_medians']
    district_log_price_avg = globals_dict['district_log_price_avg']
    global_log_price_avg = globals_dict['global_log_price_avg']
    good_dirs = globals_dict['good_dirs']
except Exception as e:
    print(json.dumps({"success": False, "message": f"Lỗi nghiêm trọng khi tải model hoặc file pickle: {str(e)}"}))
    sys.exit(1)

# =============================================================================
# SECTION 2: "BỘ DỊCH" 2025 -> 2024 VÀ TRÍCH XUẤT
# =============================================================================

def extract_location_v5(address):
    """Hàm chuyên gia, trích xuất địa chỉ theo cấu trúc 63 tỉnh thành cũ (2024)."""
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


def translate_and_extract_location(address):
    """
    "Bộ dịch" thông minh: Nhận địa chỉ theo cấu trúc MỚI (2025),
    dịch ngược về cấu trúc CŨ (2024) và trích xuất.
    """
    if pd.isna(address) or not isinstance(address, str) or not address.strip():
        return 'Other', 'Other', 'Other'
    addr_lower = address.lower()
    
    # Bản đồ dịch ngược: Tên quận/huyện đặc trưng -> Tỉnh gốc của nó năm 2024
    district_to_original_province_map = {
        # Khu vực phía Bắc
        'hà giang': 'Hà Giang', 'yên bái': 'Yên Bái', 'bắc kạn': 'Bắc Kạn',
        'vĩnh phúc': 'Vĩnh Phúc', 'vĩnh yên': 'Vĩnh Phúc', 'phúc yên': 'Vĩnh Phúc',
        'hòa bình': 'Hòa Bình', 'bắc giang': 'Bắc Giang', 'thái bình': 'Thái Bình',
        'hải dương': 'Hải Dương', 'chí linh': 'Hải Dương', 'hà nam': 'Hà Nam', 'phủ lý': 'Hà Nam',
        'nam định': 'Nam Định',
        # Khu vực miền Trung
        'quảng bình': 'Quảng Bình', 'đồng hới': 'Quảng Bình', 'quảng nam': 'Quảng Nam',
        'tam kỳ': 'Quảng Nam', 'hội an': 'Quảng Nam', 'kon tum': 'Kon Tum', 'bình định': 'Bình Định',
        'quy nhơn': 'Bình Định', 'phú yên': 'Phú Yên', 'tuy hòa': 'Phú Yên',
        'ninh thuận': 'Ninh Thuận', 'phan rang': 'Ninh Thuận', 'đắk nông': 'Đắk Nông',
        'gia nghĩa': 'Đắk Nông', 'bình thuận': 'Bình Thuận', 'phan thiết': 'Bình Thuận',
        # Khu vực phía Nam
        'bình dương': 'BD', 'thủ dầu một': 'BD', 'dĩ an': 'BD', 'thuận an': 'BD', 'tân uyên': 'BD',
        'bà rịa': 'BRVT', 'vũng tàu': 'BRVT', 'bình phước': 'Bình Phước', 'đồng xoài': 'Bình Phước',
        'long an': 'LA', 'tân an': 'LA', 'tiền giang': 'Tiền Giang', 'mỹ tho': 'Tiền Giang',
        'sóc trăng': 'Sóc Trăng', 'hậu giang': 'Hậu Giang', 'vị thanh': 'Hậu Giang',
        'bến tre': 'Bến Tre', 'trà vinh': 'Trà Vinh', 'bạc liêu': 'Bạc Liêu',
        'kiên giang': 'Kiên Giang', 'rạch giá': 'Kiên Giang', 'hà tiên': 'Kiên Giang', 'phú quốc': 'Kiên Giang'
    }

    original_address = addr_lower
    # Duyệt qua bản đồ dịch ngược
    for district_name, original_province in district_to_original_province_map.items():
        if district_name in original_address:
            # Gắn thêm tên tỉnh gốc vào cuối địa chỉ để hàm V5 nhận dạng đúng
            original_address += f", {original_province.lower()}"
            break
            
    # Sử dụng hàm V5 (chuyên gia 2024) để trích xuất từ địa chỉ đã được "dịch"
    return extract_location_v5(original_address)

# =============================================================================
# SECTION 3: HÀM MAIN (Sử dụng logic dịch thuật và feature nâng cao)
# =============================================================================
def main():
    try:
        input_data = json.loads(sys.stdin.read())
        df = pd.DataFrame([input_data])
        df.columns = df.columns.str.strip().str.replace(' ', '_').str.lower()
        
        # 1. Áp dụng "bộ dịch" và trích xuất địa chỉ
        if 'address' in df.columns:
            df['city'], df['district'], df['sub_district'] = zip(*df['address'].apply(translate_and_extract_location))
            df = df.drop(columns=['address'])

        # 2. Xử lý và điền giá trị thiếu cho các cột số
        # <<< FIX: Cần đảm bảo cột 'area' tồn tại và là số trước khi tính log >>>
        for col in numerical_cols:
            df[col] = pd.to_numeric(df.get(col, np.nan), errors='coerce')
            if pd.isna(df.at[0, col]):
                district_name = df.at[0, 'district']
                # Lấy giá trị trung vị từ globals_dict để điền
                df.at[0, col] = district_medians[col].get(district_name, overall_medians[col])

        # 3. Điền giá trị thiếu cho các cột categorical
        for col in cat_cols:
             if col in df.columns:
                df[col] = df[col].fillna('Khác').astype(str)

        # 4. Feature Engineering - Đồng bộ 100% với file training
        # <<< FIX 1: TÍNH LOG_AREA >>>
        # Đây là bước quan trọng nhất bị thiếu
        df['log_area'] = np.log1p(df['area'])

        # <<< FIX 2: TẠO CÁC FEATURE MỚI DỰA TRÊN LOG_AREA >>>
        district_name = df.at[0, 'district']
        df['district_price_modifier'] = district_log_price_avg.get(district_name, global_log_price_avg)
        
        # Đổi tên và công thức tính cho khớp với file train
        df['log_area_squared'] = df['log_area'] ** 2
        df['log_area_x_price_modifier'] = df['log_area'] * df['district_price_modifier']
        
        df['total_rooms'] = df.get('bedrooms', 0).fillna(0) + df.get('bathrooms', 0).fillna(0) + 1
        df['rooms_per_log_area'] = df['total_rooms'] / (df['log_area'] + 1e-6)
        
        df['is_good_direction'] = df.get('house_direction', '').isin(good_dirs).astype(int)

        # 5. Chuẩn bị dữ liệu cuối cùng và dự đoán
        # Đảm bảo tất cả các feature mà model cần đều có mặt
        for col in features:
            if col not in df.columns:
                df[col] = 0 # Hoặc một giá trị mặc định hợp lý khác
        X = df[features]
        
        # Dự đoán giá trị log
        pred_log = model.predict(X)
        # Chuyển đổi về giá trị thật
        pred_price = float(np.expm1(pred_log)[0])
        
        # Áp dụng hệ số tăng trưởng thị trường (đã tự cập nhật)
        final_price = pred_price * MARKET_GROWTH_FACTOR

        print(json.dumps({"success": True, "predicted_price": final_price, "debug_info": {"growth_factor": MARKET_GROWTH_FACTOR, "last_update": load_growth_state()[0]}}))
        sys.stdout.flush()

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(json.dumps({"success": False, "message": f"Lỗi trong kịch bản Python: {str(e)}", "details": error_details}))
        sys.exit(1)

if __name__ == "__main__":
    main()