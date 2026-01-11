-- ======================================================
-- PHARMACEUTICAL DRUG TRACEABILITY LOGIC
-- Demonstrating 7 Core PL/SQL Concepts
-- ======================================================

-- 7️⃣ PACKAGE: Groups related procedures & functions
CREATE OR REPLACE PACKAGE drug_trak AS
    -- Custom Exceptions
    invalid_batch_data EXCEPTION;
    
    -- 1️⃣ STORED PROCEDURE: Insert/Update data
    PROCEDURE add_batch(
        p_drug_id IN NUMBER,
        p_mfg_date IN DATE,
        p_exp_date IN DATE,
        p_qty IN NUMBER,
        p_loc IN VARCHAR2
    );

    -- 2️⃣ STORED FUNCTION: Returns calculation (Batch Health)
    FUNCTION get_batch_status(p_batch_id IN NUMBER) RETURN VARCHAR2;

    -- 3️⃣ CURSOR: Fetch multiple rows for Recall Processing
    PROCEDURE process_recall(p_drug_id IN NUMBER);
END drug_trak;
/

CREATE OR REPLACE PACKAGE BODY drug_trak AS

    PROCEDURE add_batch(
        p_drug_id IN NUMBER,
        p_mfg_date IN DATE,
        p_exp_date IN DATE,
        p_qty IN NUMBER,
        p_loc IN VARCHAR2
    ) IS
    BEGIN
        -- 4️⃣ EXCEPTION HANDLING: Validation logic
        IF p_exp_date <= p_mfg_date THEN
            RAISE invalid_batch_data;
        END IF;

        INSERT INTO batches (batch_id, drug_id, mfg_date, exp_date, quantity, location)
        VALUES (batch_id_seq.NEXTVAL, p_drug_id, p_mfg_date, p_exp_date, p_qty, p_loc);
        
        COMMIT;
    EXCEPTION
        WHEN invalid_batch_data THEN
            DBMS_OUTPUT.PUT_LINE('Error: Expiry date must be after Manufacturing date.');
            RAISE_APPLICATION_ERROR(-20001, 'Invalid Dates');
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Database error occurred: ' || SQLERRM);
            ROLLBACK;
    END add_batch;

    FUNCTION get_batch_status(p_batch_id IN NUMBER) RETURN VARCHAR2 IS
        v_exp_date DATE;
        v_status VARCHAR2(20);
    BEGIN
        SELECT exp_date, status INTO v_exp_date, v_status FROM batches WHERE batch_id = p_batch_id;
        
        IF v_status = 'RECALLED' THEN
            RETURN '⚠️ RECALLED';
        ELSIF v_exp_date < SYSDATE THEN
            RETURN '❌ EXPIRED';
        ELSE
            RETURN '✅ HEALTHY';
        END IF;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 'UNKNOWN';
    END get_batch_status;

    PROCEDURE process_recall(p_drug_id IN NUMBER) IS
        -- 3️⃣ CURSOR: Explicit cursor to find all active batches for a drug
        CURSOR c_batches IS
            SELECT batch_id FROM batches 
            WHERE drug_id = p_drug_id AND status = 'ACTIVE';
        
        v_count NUMBER := 0;
    BEGIN
        -- Cursor FOR Loop (Easy iteration)
        FOR r_batch IN c_batches LOOP
            UPDATE batches SET status = 'RECALLED' WHERE batch_id = r_batch.batch_id;
            v_count := v_count + 1;
        END LOOP;
        
        DBMS_OUTPUT.PUT_LINE('Recall processed for ' || v_count || ' batches.');
        COMMIT;
    END process_recall;

END drug_trak;
/

-- 5️⃣ TRIGGER: Automatically fires on INSERT/DELETE for auditing
CREATE OR REPLACE TRIGGER audit_batch_changes
AFTER INSERT OR DELETE ON batches
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO audit_logs (log_id, table_name, action, record_id, user_name)
        VALUES (log_id_seq.NEXTVAL, 'BATCHES', 'INSERT', :NEW.batch_id, USER);
    ELSIF DELETING THEN
        INSERT INTO audit_logs (log_id, table_name, action, record_id, user_name)
        VALUES (log_id_seq.NEXTVAL, 'BATCHES', 'DELETE', :OLD.batch_id, USER);
    END IF;
END;
/
