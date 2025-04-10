export default class HelpersFunction {
    // HELPER
    setTextTujuan = (data) => {
        return `<span>${data.name}</span><br><span>${data.alamat}</span>`;
    }

    setFormatDateLooping = (date) => {
        let html;
        html += `<ol>`;
        date.map((date, index) => {
            let tahun = date.getFullYear();
            let bulan = date.getMonth();
            let tanggal = date.getDate();
            switch(bulan) {
                case 0: bulan = "Januari"; break;
                case 1: bulan = "Februari"; break;
                case 2: bulan = "Maret"; break;
                case 3: bulan = "April"; break;
                case 4: bulan = "Mei"; break;
                case 5: bulan = "Juni"; break;
                case 6: bulan = "Juli"; break;
                case 7: bulan = "Agustus"; break;
                case 8: bulan = "September"; break;
                case 9: bulan = "Oktober"; break;
                case 10: bulan = "November"; break;
                case 11: bulan = "Desember"; break;
            }
            let tampilTanggal = tanggal + " " + bulan + " " + tahun;
            
            html += '<li>';
                html += `${tampilTanggal}`;
            html += '</li>';
        })
            
        html += `</ol>`;
        return html;
    }

    setFormatDateOnly = (date) => {
        // let date = new Date();
        let tahun = date.getFullYear();
        let bulan = date.getMonth();
        let tanggal = date.getDate();
        switch(bulan) {
            case 0: bulan = "Januari"; break;
            case 1: bulan = "Februari"; break;
            case 2: bulan = "Maret"; break;
            case 3: bulan = "April"; break;
            case 4: bulan = "Mei"; break;
            case 5: bulan = "Juni"; break;
            case 6: bulan = "Juli"; break;
            case 7: bulan = "Agustus"; break;
            case 8: bulan = "September"; break;
            case 9: bulan = "Oktober"; break;
            case 10: bulan = "November"; break;
            case 11: bulan = "Desember"; break;
        }
        let tampilTanggal = tanggal + " " + bulan + " " + tahun;
        
        return tampilTanggal;
    }

    setFormatDateNumber = (date) => {
        var d = new Date(date),
        bulan = '' + (d.getMonth() + 1),
        tanggal = '' + d.getDate(),
        tahun = d.getFullYear();
        
        if (bulan.length < 2) 
            bulan = '0' + bulan;
        if (tanggal.length < 2) 
            tanggal = '0' + tanggal;

        return [tahun, bulan, tanggal].join('-');
    }

    setFormatDate = (data) => {
        let date = data?new Date(data):new Date();
        let tahun = date.getFullYear();
        let bulan = date.getMonth();
        let tanggal = date.getDate();
        let hari = date.getDay();
        switch(hari) {
            case 0: hari = "Minggu"; break;
            case 1: hari = "Senin"; break;
            case 2: hari = "Selasa"; break;
            case 3: hari = "Rabu"; break;
            case 4: hari = "Kamis"; break;
            case 5: hari = "Jum'at"; break;
            case 6: hari = "Sabtu"; break;
        }
        switch(bulan) {
            case 0: bulan = "Januari"; break;
            case 1: bulan = "Februari"; break;
            case 2: bulan = "Maret"; break;
            case 3: bulan = "April"; break;
            case 4: bulan = "Mei"; break;
            case 5: bulan = "Juni"; break;
            case 6: bulan = "Juli"; break;
            case 7: bulan = "Agustus"; break;
            case 8: bulan = "September"; break;
            case 9: bulan = "Oktober"; break;
            case 10: bulan = "November"; break;
            case 11: bulan = "Desember"; break;
        }
        let tampilTanggal = hari + ", " + tanggal + " " + bulan + " " + tahun;
        
        return tampilTanggal;
    }
    
    setTextSigner = (data) => {
        let html = `<table style="width:100%"><tr>`;
        for (let i = 0; i < data.length; i++) {
            element = data[i];
            html += `
                <p class="mb-0" style="${element.position !== 'External' ? 'text-decoration: underline;' : ''} font-weight: bold; margin-top: 5px;">${element.user_name}</p>
                ${element.position !== 'External' ? element.position : ''}
            </td>
            `;
        }
        html += `</tr></table>`;
        return html;
    }

    setTextTable = (data) => {
        // let data = optionSigner.value;
        let html = `<table style="width:50%">`;
        let header = Object.keys(data[0]); //['name', 'jabatan', 'id']
        
        //set header table
        html += '<tr>';
            header.forEach(el => {
                html += `<th>${el}</th>`;
        });
        html += '</tr>';
        
        //set body table
        for (let i = 0; i < data.length; i++) {
            element = data[i];
            // if (i === 0) {
            html += '<tr>';
            header.forEach(el => {
                html += `<td>${element[el]}</td>`;
            });
            html += '</tr>';
        }
        html += `</table>`;
        return html;
    }

    setTextList = (data) => {
        // let data = optionSigner.value;
        let html;
        html = '<p>Tembusan : </p>';
        html += `<ol>`;
        let header = Object.keys(data[0]); //['name', 'jabatan', 'id']
        
        //set header table
        // html += '<tr>';
        //     header.forEach(el => {
        //         html += `<th>${el}</th>`;
        // });
        // html += '</tr>';
        
        //set body table
        for (let i = 0; i < data.length; i++) {
            element = data[i];
            // if (i === 0) {
            html += '<li>';
            // header.forEach(el => {
                html += `${element.user_name}`;
            // });
            html += '</li>';
        }
        html += `</ol>`;
        return html;
    }

    romanize (num) {
        if (!+num)
            return false;
        var digits = String(+num).split(""),
            key    = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                    "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                    "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman  = "",
            i      = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }
    // END HELPER
}