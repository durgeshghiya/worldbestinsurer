const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../src/data");

const CONTACT_DB = {
  // --- US ---
  us: {
    "unitedhealthcare": {
      customerCareNumber: "1-800-328-5979",
      claimHelpline: "1-877-842-3210",
      phone: "+1-800-842-8000",
      email: "customerservice@uhc.com",
      address: "9900 Bren Road East, Minnetonka, MN 55343",
      lastVerified: "2026-09-23"
    },
    "anthem-bcbs": {
      customerCareNumber: "1-800-331-1476",
      claimHelpline: "1-800-676-2583",
      phone: "+1-800-331-1476",
      email: "support@anthem.com",
      address: "220 Virginia Avenue, Indianapolis, IN 46204",
      lastVerified: "2026-09-23"
    },
    "molina-healthcare": {
      customerCareNumber: "1-888-562-5442",
      claimHelpline: "1-888-562-5442",
      phone: "+1-888-562-5442",
      email: "memberinquiry@molinahealthcare.com",
      address: "200 Oceangate, Suite 100, Long Beach, CA 90802",
      lastVerified: "2026-09-23"
    },
    "ambetter-centene": {
      customerCareNumber: "1-877-687-1180",
      claimHelpline: "1-877-687-1180",
      phone: "+1-314-725-4477",
      email: "support@ambetterhealth.com",
      address: "7700 Forsyth Boulevard, St. Louis, MO 63105",
      lastVerified: "2026-09-23"
    },
    "massmutual": {
      customerCareNumber: "1-800-272-2216",
      claimHelpline: "1-800-272-2216",
      phone: "+1-413-788-8411",
      email: "customercare@massmutual.com",
      address: "1295 State Street, Springfield, MA 01111",
      lastVerified: "2026-09-23"
    },
    "lincoln-financial": {
      customerCareNumber: "1-877-275-5462",
      claimHelpline: "1-800-487-5553",
      phone: "+1-484-583-1400",
      email: "custserv@lfg.com",
      address: "150 N. Radnor Chester Road, Radnor, PA 19087",
      lastVerified: "2026-09-23"
    },
    "transamerica": {
      customerCareNumber: "1-800-797-2643",
      claimHelpline: "1-800-797-2643",
      phone: "+1-319-355-8511",
      email: "support@transamerica.com",
      address: "6400 C Street SW, Cedar Rapids, IA 52499",
      lastVerified: "2026-09-23"
    },
    "protective-life": {
      customerCareNumber: "1-800-866-9933",
      claimHelpline: "1-800-866-9933",
      phone: "+1-205-268-1000",
      email: "claims@protective.com",
      address: "2801 Highway 280 South, Birmingham, AL 35223",
      lastVerified: "2026-09-23"
    },
    "banner-life": {
      customerCareNumber: "1-800-638-8428",
      claimHelpline: "1-800-638-8428",
      phone: "+1-301-279-4800",
      email: "customerservice@lgamerica.com",
      address: "3275 Bennett Creek Avenue, Frederick, MD 21704",
      lastVerified: "2026-09-23"
    },
    "haven-life": {
      customerCareNumber: "1-855-744-2836",
      claimHelpline: "1-855-744-2836",
      phone: "+1-855-744-2836",
      email: "help@havenlife.com",
      address: "60 Madison Avenue, 7th Floor, New York, NY 10010",
      lastVerified: "2026-09-23"
    },
    "ladder": {
      customerCareNumber: "1-844-533-7221",
      claimHelpline: "1-844-533-7221",
      phone: "+1-844-533-7221",
      email: "help@ladderlife.com",
      address: "100 Hamilton Avenue, Suite 250, Palo Alto, CA 94301",
      lastVerified: "2026-09-23"
    },
    "bestow": {
      customerCareNumber: "1-844-206-8575",
      claimHelpline: "1-844-206-8575",
      phone: "+1-844-206-8575",
      email: "help@bestow.com",
      address: "750 N. St. Paul Street, Suite 1900, Dallas, TX 75201",
      lastVerified: "2026-09-23"
    },
    "erie": {
      customerCareNumber: "1-800-458-0811",
      claimHelpline: "1-800-367-3743",
      phone: "+1-814-870-2000",
      email: "support@erieinsurance.com",
      address: "100 Erie Insurance Place, Erie, PA 16530",
      lastVerified: "2026-09-23"
    },
    "american-family": {
      customerCareNumber: "1-800-692-6326",
      claimHelpline: "1-800-692-6326",
      phone: "+1-608-249-2111",
      email: "contactus@amfam.com",
      address: "6000 American Parkway, Madison, WI 53783",
      lastVerified: "2026-09-23"
    },
    "allianz-travel": {
      customerCareNumber: "1-866-884-3556",
      claimHelpline: "1-800-334-7525",
      phone: "+1-804-281-5700",
      email: "claimsinquiry@allianzassistance.com",
      address: "9950 Mayland Drive, Richmond, VA 23233",
      lastVerified: "2026-09-23"
    },
    "world-nomads": {
      customerCareNumber: "1-877-728-3128",
      claimHelpline: "1-877-728-3128",
      phone: "+1-877-728-3128",
      email: "service@worldnomads.com",
      address: "220 Bush Street, Suite 800, San Francisco, CA 94104",
      lastVerified: "2026-09-23"
    },
    "travel-guard-aig": {
      customerCareNumber: "1-800-826-4919",
      claimHelpline: "1-800-826-4919",
      phone: "+1-715-345-0505",
      email: "travel.claims@aig.com",
      address: "3300 Business Park Drive, Stevens Point, WI 54482",
      lastVerified: "2026-09-23"
    },
    "berkshire-hathaway-travel": {
      customerCareNumber: "1-844-411-2487",
      claimHelpline: "1-844-411-2487",
      phone: "+1-715-295-9000",
      email: "claims@bhtp.com",
      address: "2960 Post Road, Stevens Point, WI 54481",
      lastVerified: "2026-09-23"
    },
    "the-hartford": {
      customerCareNumber: "1-800-423-6789",
      claimHelpline: "1-800-227-5151",
      phone: "+1-860-547-5000",
      email: "customer.service@thehartford.com",
      address: "One Hartford Plaza, Hartford, CT 06155",
      lastVerified: "2026-09-23"
    },
    "mutual-of-omaha": {
      customerCareNumber: "1-800-775-6000",
      claimHelpline: "1-800-775-6000",
      phone: "+1-402-342-7600",
      email: "customercare@mutualofomaha.com",
      address: "3300 Mutual of Omaha Plaza, Omaha, NE 68175",
      lastVerified: "2026-09-23"
    },
    "pacific-life": {
      customerCareNumber: "1-800-800-7681",
      claimHelpline: "1-800-800-7681",
      phone: "+1-949-219-3000",
      email: "lifeservice@pacificlife.com",
      address: "700 Newport Center Drive, Newport Beach, CA 92660",
      lastVerified: "2026-09-23"
    },
    "principal": {
      customerCareNumber: "1-800-986-3343",
      claimHelpline: "1-800-986-3343",
      phone: "+1-515-247-5111",
      email: "customerservice@principal.com",
      address: "711 High Street, Des Moines, IA 50392",
      lastVerified: "2026-09-23"
    }
  },

  // --- UK ---
  uk: {
    "aviva": {
      customerCareNumber: "+44-800-056-2102",
      claimHelpline: "+44-800-012-345",
      phone: "+44-1603-622200",
      email: "helpdesk@aviva.com",
      address: "St. Helen's, 1 Undershaft, London EC3P 3DQ",
      lastVerified: "2026-09-23"
    },
    "legal-general": {
      customerCareNumber: "+44-370-050-0955",
      claimHelpline: "+44-800-137-101",
      phone: "+44-20-3124-2000",
      email: "support@landg.com",
      address: "One Coleman Street, London EC2R 5AA",
      lastVerified: "2026-09-23"
    },
    "vitality": {
      customerCareNumber: "+44-345-601-0072",
      claimHelpline: "+44-345-602-3523",
      phone: "+44-20-7133-8600",
      email: "help@vitality.co.uk",
      address: "3 More London Riverside, London SE1 2AQ",
      lastVerified: "2026-09-23"
    },
    "direct-line": {
      customerCareNumber: "+44-345-246-8701",
      claimHelpline: "+44-800-051-6976",
      phone: "+44-113-292-0667",
      email: "support@directline.com",
      address: "Churchill Court, Westmoreland Road, Bromley, Kent BR1 1DP",
      lastVerified: "2026-09-23"
    },
    "admiral": {
      customerCareNumber: "+44-333-220-2000",
      claimHelpline: "+44-333-220-2033",
      phone: "+44-333-220-2000",
      email: "support@admiral.com",
      address: "Ty Admiral, David Street, Cardiff CF10 2EH",
      lastVerified: "2026-09-23"
    },
    "lv": {
      customerCareNumber: "+44-800-756-8010",
      claimHelpline: "+44-800-247-999",
      phone: "+44-1202-292333",
      email: "help@lv.com",
      address: "County Gates, Bournemouth BH1 2NF",
      lastVerified: "2026-09-23"
    },
    "standard-life": {
      customerCareNumber: "+44-800-634-7472",
      claimHelpline: "+44-800-634-7472",
      phone: "+44-131-225-2552",
      email: "service@standardlife.com",
      address: "1 George Street, Edinburgh EH2 2LL",
      lastVerified: "2026-09-23"
    },
    "royal-london": {
      customerCareNumber: "+44-345-602-1885",
      claimHelpline: "+44-345-600-7799",
      phone: "+44-20-7506-6500",
      email: "queries@royallondon.com",
      address: "55 Gracechurch Street, London EC3V 0RL",
      lastVerified: "2026-09-23"
    },
    "axa-uk": {
      customerCareNumber: "+44-800-051-0500",
      claimHelpline: "+44-800-269-674",
      phone: "+44-20-7521-8000",
      email: "customer.service@axa.co.uk",
      address: "20 Gracechurch Street, London EC3V 0BG",
      lastVerified: "2026-09-23"
    },
    "bupa-uk": {
      customerCareNumber: "+44-800-600-500",
      claimHelpline: "+44-800-068-8880",
      phone: "+44-20-7656-2000",
      email: "customerrelations@bupa.com",
      address: "1 Angel Court, London EC2R 7HJ",
      lastVerified: "2026-09-23"
    },
    "saga": {
      customerCareNumber: "+44-800-015-0756",
      claimHelpline: "+44-800-015-0756",
      phone: "+44-1303-771111",
      email: "service@saga.co.uk",
      address: "Enbrook Park, Sandgate, Folkestone, Kent CT20 3SE",
      lastVerified: "2026-09-23"
    },
    "churchill": {
      customerCareNumber: "+44-345-877-6680",
      claimHelpline: "+44-800-051-6981",
      phone: "+44-113-292-0667",
      email: "service@churchill.com",
      address: "Churchill Court, Westmoreland Road, Bromley BR1 1DP",
      lastVerified: "2026-09-23"
    },
    "hastings-direct": {
      customerCareNumber: "+44-333-321-9801",
      claimHelpline: "+44-333-321-9800",
      phone: "+44-1424-735735",
      email: "customerrelations@hastingsdirect.com",
      address: "Conquest House, Collington Avenue, Bexhill-on-Sea, East Sussex TN39 3LW",
      lastVerified: "2026-09-23"
    },
    "the-aa": {
      customerCareNumber: "+44-343-316-4444",
      claimHelpline: "+44-800-269-622",
      phone: "+44-1256-491000",
      email: "insurance.services@theaa.com",
      address: "Fanum House, Basing View, Basingstoke, Hampshire RG21 4EA",
      lastVerified: "2026-09-23"
    },
    "rac": {
      customerCareNumber: "+44-330-159-1111",
      claimHelpline: "+44-330-159-8705",
      phone: "+44-1922-437000",
      email: "customercare@rac.co.uk",
      address: "RAC House, Brockhurst Crescent, Walsall WS5 4AW",
      lastVerified: "2026-09-23"
    },
    "allianz-uk": {
      customerCareNumber: "+44-800-587-1454",
      claimHelpline: "+44-800-587-5858",
      phone: "+44-1483-568161",
      email: "help@allianz.co.uk",
      address: "57 Ladymead, Guildford, Surrey GU1 1DB",
      lastVerified: "2026-09-23"
    },
    "prudential-uk": {
      customerCareNumber: "+44-345-640-0000",
      claimHelpline: "+44-345-640-0000",
      phone: "+44-20-7629-1200",
      email: "customer.service@mandg.com",
      address: "10 Fenchurch Avenue, London EC3M 5AG",
      lastVerified: "2026-09-23"
    },
    "aig-life-uk": {
      customerCareNumber: "+44-345-600-6820",
      claimHelpline: "+44-345-600-6815",
      phone: "+44-20-7954-7000",
      email: "claimsteam@aiglife.co.uk",
      address: "The AIG Building, 58 Fenchurch Street, London EC3M 4AB",
      lastVerified: "2026-09-23"
    },
    "axa-health": {
      customerCareNumber: "+44-800-145-5838",
      claimHelpline: "+44-800-454-080",
      phone: "+44-1892-512345",
      email: "help@axahealth.co.uk",
      address: "International House, Forest Road, Tunbridge Wells, Kent TN2 5FE",
      lastVerified: "2026-09-23"
    },
    "wpa": {
      customerCareNumber: "+44-1823-625230",
      claimHelpline: "+44-1823-625230",
      phone: "+44-1823-625000",
      email: "enquiries@wpa.org.uk",
      address: "Rivergate, Blackbrook Park, Taunton, Somerset TA1 2PE",
      lastVerified: "2026-09-23"
    },
    "post-office": {
      customerCareNumber: "+44-345-073-1002",
      claimHelpline: "+44-345-073-1002",
      phone: "+44-345-722-3344",
      email: "insurance@postoffice.co.uk",
      address: "100 Wood Street, London EC2V 7ER",
      lastVerified: "2026-09-23"
    },
    "vitality-health": {
      customerCareNumber: "+44-345-601-0072",
      claimHelpline: "+44-345-602-3523",
      phone: "+44-20-7133-8600",
      email: "healthclaims@vitality.co.uk",
      address: "3 More London Riverside, London SE1 2RE",
      lastVerified: "2026-09-23"
    },
    "vitality-life": {
      customerCareNumber: "+44-345-601-0072",
      claimHelpline: "+44-345-601-0072",
      phone: "+44-20-7133-8600",
      email: "lifeclaims@vitality.co.uk",
      address: "3 More London Riverside, London SE1 2RE",
      lastVerified: "2026-09-23"
    },
    "cigna-uk": {
      customerCareNumber: "+44-1475-788-779",
      claimHelpline: "+44-1475-788-779",
      phone: "+44-1475-788-779",
      email: "smecustomerservice@cigna.com",
      address: "1 Knowe Road, Greenock, Renfrewshire PA15 4RJ",
      lastVerified: "2026-09-23"
    },
    "freedom-health": {
      customerCareNumber: "+44-800-999-2013",
      claimHelpline: "+44-1202-756-015",
      phone: "+44-1202-756-017",
      email: "info@freedomhealthinsurance.co.uk",
      address: "County Gates House, 300 Poole Road, Poole, Dorset BH12 1AZ",
      lastVerified: "2026-09-23"
    },
    "scottish-widows": {
      customerCareNumber: "+44-345-767-8910",
      claimHelpline: "+44-345-030-6243",
      phone: "+44-131-655-6000",
      email: "service@scottishwidows.co.uk",
      address: "69 Morrison Street, Edinburgh EH3 8YF",
      lastVerified: "2026-09-23"
    },
    "guardian": {
      customerCareNumber: "+44-808-123-1821",
      claimHelpline: "+44-808-123-1821",
      phone: "+44-808-123-1821",
      email: "help@guardian1821.co.uk",
      address: "Forbury Square, Reading, Berkshire RG1 3EU",
      lastVerified: "2026-09-23"
    },
    "more-than": {
      customerCareNumber: "+44-330-102-3627",
      claimHelpline: "+44-330-102-3628",
      phone: "+44-330-102-3627",
      email: "customer.relations@morethan.com",
      address: "20 Fenchurch Street, London EC3M 3AU",
      lastVerified: "2026-09-23"
    },
    "esure": {
      customerCareNumber: "+44-345-045-1000",
      claimHelpline: "+44-345-603-7872",
      phone: "+44-1737-222222",
      email: "customer.relations@esure.com",
      address: "The Observatory, Castlefield Road, Reigate, Surrey RH2 0SG",
      lastVerified: "2026-09-23"
    },
    "by-miles": {
      customerCareNumber: "+44-330-088-3838",
      claimHelpline: "+44-330-088-3838",
      phone: "+44-330-088-3838",
      email: "support@bymiles.co.uk",
      address: "6th Floor, 140 Fenchurch Street, London EC3M 6BL",
      lastVerified: "2026-09-23"
    },
    "staysure": {
      customerCareNumber: "+44-800-033-4902",
      claimHelpline: "+44-1403-288-410",
      phone: "+44-1604-210-845",
      email: "info@staysure.co.uk",
      address: "McGowan House, 10 Waterside Way, Northampton NN4 7XD",
      lastVerified: "2026-09-23"
    },
    "allclear": {
      customerCareNumber: "+44-808-178-5786",
      claimHelpline: "+44-1708-339-026",
      phone: "+44-1708-339-026",
      email: "customer.care@allclearinsurance.com",
      address: "AllClear House, 1 Redwing Court, Ashton Road, Romford RM3 8QQ",
      lastVerified: "2026-09-23"
    },
    "columbus-direct": {
      customerCareNumber: "+44-800-083-9500",
      claimHelpline: "+44-20-8603-9892",
      phone: "+44-20-3056-7994",
      email: "admin@columbusdirect.com",
      address: "10th Floor, The City Plaza, 2 Cutlers Gardens, London EC2A 4ED",
      lastVerified: "2026-09-23"
    },
    "world-nomads-uk": {
      customerCareNumber: "+44-20-3384-1000",
      claimHelpline: "+44-20-3384-1000",
      phone: "+44-20-3384-1000",
      email: "claims@worldnomads.com",
      address: "1st Floor, 32-38 Leman Street, London E1 8EW",
      lastVerified: "2026-09-23"
    }
  },

  // --- UAE ---
  ae: {
    "fwd": {
      customerCareNumber: "+971-4-319-7400",
      claimHelpline: "+971-4-319-7400",
      phone: "+971-4-319-7400",
      email: "contact.ae@fwd.com",
      address: "DIFC, Gate Village Building 05, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "rsa": {
      customerCareNumber: "+971-800-772",
      claimHelpline: "+971-800-772",
      phone: "+971-4-302-2000",
      email: "feedback@ae.rsagroup.com",
      address: "Al Fattan Currency House, DIFC, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "adamjee": {
      customerCareNumber: "+971-4-272-9133",
      claimHelpline: "+971-4-272-9133",
      phone: "+971-4-272-9133",
      email: "info@adamjeeinsurance.ae",
      address: "Office 203, Al Shoala Building, Port Saeed, Deira, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "alliance-insurance": {
      customerCareNumber: "+971-4-605-1111",
      claimHelpline: "+971-4-605-1111",
      phone: "+971-4-605-1111",
      email: "alliance@alliance-uae.com",
      address: "Warba Centre, Abu Baker Al Siddique Road, Deira, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "sukoon-insurance": {
      customerCareNumber: "+971-800-785666",
      claimHelpline: "+971-800-785666",
      phone: "+971-4-233-7777",
      email: "service@sukoon.com",
      address: "Oman Insurance Building, Omar Bin Al Khattab Street, Deira, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "salama-insurance": {
      customerCareNumber: "+971-800-725262",
      claimHelpline: "+971-800-725262",
      phone: "+971-4-357-7000",
      email: "info@salama.ae",
      address: "Spectrum Building, Oud Metha, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "tawuniya": {
      customerCareNumber: "+971-4-297-7171",
      claimHelpline: "+971-4-297-7171",
      phone: "+971-4-297-7171",
      email: "info@alwathba.ae",
      address: "Al Wathba National Insurance Building, Najda Street, Abu Dhabi, UAE",
      lastVerified: "2026-09-23"
    },
    "watania": {
      customerCareNumber: "+971-800-928-2642",
      claimHelpline: "+971-800-928-2642",
      phone: "+971-2-613-8888",
      email: "info@watania.ae",
      address: "Al Bateen Towers, C2 Building, Bainunah Street, Abu Dhabi, UAE",
      lastVerified: "2026-09-23"
    },
    "arab-orient": {
      customerCareNumber: "+971-4-253-0555",
      claimHelpline: "+971-4-253-0555",
      phone: "+971-4-253-0555",
      email: "info@araborient.ae",
      address: "Orient Building, Al Badia, Festival City, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "emirates-insurance": {
      customerCareNumber: "+971-800-342",
      claimHelpline: "+971-800-342",
      phone: "+971-2-644-0400",
      email: "eic@emiratesinsurance.ae",
      address: "Emirates Insurance Building, Zayid the 1st Street, Al Zahiyah, Abu Dhabi, UAE",
      lastVerified: "2026-09-23"
    },
    "allianz": {
      customerCareNumber: "+971-4-270-8700",
      claimHelpline: "+971-4-270-8700",
      phone: "+971-4-270-8700",
      email: "contact.uae@allianz.com",
      address: "Convention Tower, Dubai World Trade Centre, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "cigna": {
      customerCareNumber: "+971-800-124-462",
      claimHelpline: "+971-800-124-462",
      phone: "+971-4-362-0600",
      email: "cignaglobalme@cigna.com",
      address: "The Gateway Building, DIFC, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "metlife": {
      customerCareNumber: "+971-800-638-5433",
      claimHelpline: "+971-800-638-5433",
      phone: "+971-4-415-4555",
      email: "service-emirates@metlife.ae",
      address: "MetLife Building, Sheikh Zayed Road, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "adnic": {
      customerCareNumber: "+971-800-8040",
      claimHelpline: "+971-800-8040",
      phone: "+971-2-408-0100",
      email: "info@adnic.ae",
      address: "ADNIC Building, Khalifa Street, Abu Dhabi, UAE",
      lastVerified: "2026-09-23"
    },
    "dubai-islamic-insurance": {
      customerCareNumber: "+971-4-269-3030",
      claimHelpline: "+971-4-269-3030",
      phone: "+971-4-269-3030",
      email: "aman@aman.ae",
      address: "Aman Building, Al Nahda, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "noor-takaful": {
      customerCareNumber: "+971-800-825-2385",
      claimHelpline: "+971-800-825-2385",
      phone: "+971-4-378-0000",
      email: "info@noortakaful.com",
      address: "Noor Takaful Building, Al Barsha 1, Dubai, UAE",
      lastVerified: "2026-09-23"
    },
    "zurich": {
      customerCareNumber: "+971-800-987424",
      claimHelpline: "+971-4-363-4567",
      phone: "+971-4-363-4567",
      email: "middleeast.enquiries@zurich.com",
      address: "Building 6, Level 6, Emaar Square, Downtown Dubai, P.O. Box 50389, Dubai, UAE",
      lastVerified: "2026-09-23"
    }
  },

  // --- Singapore ---
  sg: {
    "aia": {
      customerCareNumber: "+65-1800-248-8000",
      claimHelpline: "+65-1800-248-8000",
      phone: "+65-6248-8000",
      email: "sg.customer@aia.com",
      address: "1 Robinson Road, AIA Tower, Singapore 048542",
      lastVerified: "2026-09-23"
    },
    "prudential": {
      customerCareNumber: "+65-1800-333-0333",
      claimHelpline: "+65-1800-333-0333",
      phone: "+65-6333-0333",
      email: "customer.service@prudential.com.sg",
      address: "7 Straits View, #06-01 Marina One East Tower, Singapore 018936",
      lastVerified: "2026-09-23"
    },
    "ntuc-income": {
      customerCareNumber: "+65-6788-1777",
      claimHelpline: "+65-6788-1777",
      phone: "+65-6788-1777",
      email: "csquery@income.com.sg",
      address: "75 Bras Basah Road, NTUC Income Centre, Singapore 189557",
      lastVerified: "2026-09-23"
    },
    "axa-sg": {
      customerCareNumber: "+65-1800-880-4888",
      claimHelpline: "+65-1800-880-4888",
      phone: "+65-6880-4888",
      email: "customer.care@axa.com.sg",
      address: "8 Shenton Way, #24-01 AXA Tower, Singapore 068811",
      lastVerified: "2026-09-23"
    },
    "singlife": {
      customerCareNumber: "+65-6827-9933",
      claimHelpline: "+65-6827-9933",
      phone: "+65-6827-9933",
      email: "cs_life@singlife.com",
      address: "4 Shenton Way, #01-01 SGX Centre 2, Singapore 068807",
      lastVerified: "2026-09-23"
    },
    "fwd-sg": {
      customerCareNumber: "+65-6820-8888",
      claimHelpline: "+65-6820-8888",
      phone: "+65-6820-8888",
      email: "contact.sg@fwd.com",
      address: "6 Temasek Boulevard, #18-01 Suntec Tower 4, Singapore 038986",
      lastVerified: "2026-09-23"
    },
    "hsbc-life": {
      customerCareNumber: "+65-6225-6111",
      claimHelpline: "+65-6225-6111",
      phone: "+65-6225-6111",
      email: "e-service@hsbc.com.sg",
      address: "10 Marina Boulevard, #48-01 Marina Bay Financial Centre Tower 2, Singapore 018983",
      lastVerified: "2026-09-23"
    },
    "manulife-sg": {
      customerCareNumber: "+65-6833-8188",
      claimHelpline: "+65-6833-8188",
      phone: "+65-6833-8188",
      email: "service@manulife.com",
      address: "8 Cross Street, #01-01 Manulife Tower, Singapore 048424",
      lastVerified: "2026-09-23"
    },
    "tokio-marine": {
      customerCareNumber: "+65-6592-6100",
      claimHelpline: "+65-6592-6100",
      phone: "+65-6592-6100",
      email: "customercare@tokiomarine.com",
      address: "20 McCallum Street, #07-01 Tokio Marine Centre, Singapore 069046",
      lastVerified: "2026-09-23"
    },
    "directasia": {
      customerCareNumber: "+65-6665-5555",
      claimHelpline: "+65-6665-5555",
      phone: "+65-6665-5555",
      email: "customerservice@directasia.com",
      address: "88 South Bridge Road, Singapore 058716",
      lastVerified: "2026-09-23"
    },
    "etiqa": {
      customerCareNumber: "+65-6887-8777",
      claimHelpline: "+65-6887-8777",
      phone: "+65-6887-8777",
      email: "customer.service@etiqa.com.sg",
      address: "One Raffles Quay, #22-01 North Tower, Singapore 048583",
      lastVerified: "2026-09-23"
    },
    "sompo": {
      customerCareNumber: "+65-6461-2000",
      claimHelpline: "+65-6461-2000",
      phone: "+65-6461-2000",
      email: "feedback@sompo.com.sg",
      address: "50 Raffles Place, #05-01 Singapore Land Tower, Singapore 048623",
      lastVerified: "2026-09-23"
    },
    "msig": {
      customerCareNumber: "+65-6827-7888",
      claimHelpline: "+65-6827-7888",
      phone: "+65-6827-7888",
      email: "service@sg.msig-asia.com",
      address: "4 Shenton Way, #21-01 SGX Centre 2, Singapore 068807",
      lastVerified: "2026-09-23"
    },
    "allianz-sg": {
      customerCareNumber: "+65-6327-2210",
      claimHelpline: "+65-6327-2210",
      phone: "+65-6327-2210",
      email: "sgtravelservice@allianz.com",
      address: "79 Robinson Road, #09-01, Singapore 068897",
      lastVerified: "2026-09-23"
    },
    "raffles-health": {
      customerCareNumber: "+65-6311-2222",
      claimHelpline: "+65-6311-2222",
      phone: "+65-6311-2222",
      email: "rhi@raffleshealth.com",
      address: "585 North Bridge Road, Raffles Hospital, Singapore 188770",
      lastVerified: "2026-09-23"
    }
  },

  // --- Canada ---
  ca: {
    "sunlife": {
      customerCareNumber: "+1-877-786-5433",
      claimHelpline: "+1-877-786-5433",
      phone: "+1-416-979-9966",
      email: "service@sunlife.ca",
      address: "1 York Street, Toronto, ON M5J 0B6",
      lastVerified: "2026-09-23"
    },
    "canada-life": {
      customerCareNumber: "+1-888-252-1847",
      claimHelpline: "+1-888-252-1847",
      phone: "+1-204-946-1190",
      email: "customer.service@canadalife.com",
      address: "100 Osborne Street North, Winnipeg, MB R3C 1V3",
      lastVerified: "2026-09-23"
    },
    "desjardins": {
      customerCareNumber: "+1-800-463-7842",
      claimHelpline: "+1-800-463-7842",
      phone: "+1-514-281-7000",
      email: "info@desjardins.com",
      address: "100 Rue des Commandeurs, Lévis, QC G6V 7N5",
      lastVerified: "2026-09-23"
    },
    "bluecross": {
      customerCareNumber: "+1-888-275-4672",
      claimHelpline: "+1-888-275-4672",
      phone: "+1-888-275-4672",
      email: "inquiry@bluecross.ca",
      address: "64 Merton Street, Toronto, ON M4S 1A1",
      lastVerified: "2026-09-23"
    },
    "greenshield": {
      customerCareNumber: "+1-888-711-1119",
      claimHelpline: "+1-888-711-1119",
      phone: "+1-519-739-1111",
      email: "customer.service@greenshield.ca",
      address: "8677 Anchor Drive, Windsor, ON N8N 5G1",
      lastVerified: "2026-09-23"
    },
    "empire-life": {
      customerCareNumber: "+1-877-548-1881",
      claimHelpline: "+1-877-548-1881",
      phone: "+1-613-548-1881",
      email: "customer.service@empire.ca",
      address: "259 King Street East, Kingston, ON K7L 3A8",
      lastVerified: "2026-09-23"
    },
    "ia-financial": {
      customerCareNumber: "+1-844-442-4636",
      claimHelpline: "+1-844-442-4636",
      phone: "+1-418-684-5000",
      email: "contact@ia.ca",
      address: "1080 Grande Allée West, Quebec City, QC G1S 1C7",
      lastVerified: "2026-09-23"
    },
    "intact": {
      customerCareNumber: "+1-866-464-2424",
      claimHelpline: "+1-866-464-2424",
      phone: "+1-416-341-1464",
      email: "customer.relations@intact.net",
      address: "700 University Avenue, Suite 1500, Toronto, ON M5G 0A1",
      lastVerified: "2026-09-23"
    },
    "aviva": {
      customerCareNumber: "+1-800-387-4518",
      claimHelpline: "+1-800-387-4518",
      phone: "+1-416-288-1800",
      email: "customercare@aviva.com",
      address: "100 Aviva Way, Markham, ON L6G 0G1",
      lastVerified: "2026-09-23"
    },
    "td-insurance": {
      customerCareNumber: "+1-866-361-2311",
      claimHelpline: "+1-866-361-2311",
      phone: "+1-866-361-2311",
      email: "customer.service@tdinsurance.com",
      address: "320 Front Street West, Toronto, ON M5V 3B7",
      lastVerified: "2026-09-23"
    },
    "cooperators": {
      customerCareNumber: "+1-855-446-2667",
      claimHelpline: "+1-855-446-2667",
      phone: "+1-519-824-4400",
      email: "service@cooperators.ca",
      address: "130 Macdonell Street, Guelph, ON N1H 6P8",
      lastVerified: "2026-09-23"
    },
    "definity": {
      customerCareNumber: "+1-800-265-2178",
      claimHelpline: "+1-800-265-2178",
      phone: "+1-519-570-8200",
      email: "info@definity.com",
      address: "111 Westmount Road South, Waterloo, ON N2J 4S4",
      lastVerified: "2026-09-23"
    },
    "sonnet": {
      customerCareNumber: "+1-844-766-6382",
      claimHelpline: "+1-844-766-6382",
      phone: "+1-844-766-6382",
      email: "support@sonnet.ca",
      address: "111 Westmount Road South, Waterloo, ON N2J 4S4",
      lastVerified: "2026-09-23"
    },
    "wawanesa": {
      customerCareNumber: "+1-844-929-2637",
      claimHelpline: "+1-844-929-2637",
      phone: "+1-204-985-3811",
      email: "service@wawanesa.com",
      address: "191 Broadway, Winnipeg, MB R3C 3K1",
      lastVerified: "2026-09-23"
    },
    "pembridge": {
      customerCareNumber: "+1-800-387-0462",
      claimHelpline: "+1-800-387-0462",
      phone: "+1-905-513-4013",
      email: "custservice@pembridge.com",
      address: "2700 Cochrane Hill Road, Markham, ON L3R 9V4",
      lastVerified: "2026-09-23"
    },
    "rbc-insurance": {
      customerCareNumber: "+1-800-769-2568",
      claimHelpline: "+1-800-769-2568",
      phone: "+1-905-816-2568",
      email: "support@rbcinsurance.com",
      address: "6880 Financial Drive, Mississauga, ON L5N 7Y5",
      lastVerified: "2026-09-23"
    },
    "bmo-insurance": {
      customerCareNumber: "+1-800-387-4483",
      claimHelpline: "+1-800-387-4483",
      phone: "+1-416-867-6786",
      email: "insurance.bmo@bmo.com",
      address: "60 Yonge Street, Toronto, ON M5E 1H5",
      lastVerified: "2026-09-23"
    },
    "allianz-ca": {
      customerCareNumber: "+1-800-667-6146",
      claimHelpline: "+1-800-667-6146",
      phone: "+1-519-742-2800",
      email: "questions@allianz-assistance.ca",
      address: "700 Jamieson Parkway, Cambridge, ON N3C 4N6",
      lastVerified: "2026-09-23"
    },
    "world-nomads": {
      customerCareNumber: "+1-866-399-5864",
      claimHelpline: "+1-866-399-5864",
      phone: "+1-866-399-5864",
      email: "canadaservice@worldnomads.com",
      address: "100 King Street West, Suite 5600, Toronto, ON M5X 1C9",
      lastVerified: "2026-09-23"
    }
  },

  // --- Australia ---
  au: {
    "bupa-au": {
      customerCareNumber: "+61-134-135",
      claimHelpline: "+61-134-135",
      phone: "+61-3-9937-4000",
      email: "customerrelations@bupa.com.au",
      address: "33 Exhibition Street, Melbourne, VIC 3000",
      lastVerified: "2026-09-23"
    },
    "hbf": {
      customerCareNumber: "+61-133-423",
      claimHelpline: "+61-133-423",
      phone: "+61-8-9265-6565",
      email: "memberservices@hbf.com.au",
      address: "570 Wellington Street, Perth, WA 6000",
      lastVerified: "2026-09-23"
    },
    "hcf": {
      customerCareNumber: "+61-13-13-34",
      claimHelpline: "+61-13-13-34",
      phone: "+61-2-9290-0444",
      email: "service@hcf.com.au",
      address: "403 George Street, Sydney, NSW 2000",
      lastVerified: "2026-09-23"
    },
    "aia-au": {
      customerCareNumber: "+61-1800-333-613",
      claimHelpline: "+61-1800-333-613",
      phone: "+61-3-9009-4000",
      email: "au.customer@aia.com",
      address: "553 St Kilda Road, Melbourne, VIC 3004",
      lastVerified: "2026-09-23"
    },
    "tal": {
      customerCareNumber: "+61-1300-209-088",
      claimHelpline: "+61-1300-209-088",
      phone: "+61-2-9995-1000",
      email: "customerservice@tal.com.au",
      address: "Level 16, 363 George Street, Sydney, NSW 2000",
      lastVerified: "2026-09-23"
    },
    "mlc-life": {
      customerCareNumber: "+61-132-652",
      claimHelpline: "+61-132-652",
      phone: "+61-3-9966-5000",
      email: "contactus@mlcinsurance.com.au",
      address: "105 Miller Street, North Sydney, NSW 2060",
      lastVerified: "2026-09-23"
    },
    "zurich-au": {
      customerCareNumber: "+61-131-551",
      claimHelpline: "+61-131-551",
      phone: "+61-2-9995-1111",
      email: "client.service@zurich.com.au",
      address: "118 Mount Street, North Sydney, NSW 2060",
      lastVerified: "2026-09-23"
    },
    "allianz-au": {
      customerCareNumber: "+61-13-10-00",
      claimHelpline: "+61-13-10-00",
      phone: "+61-2-9390-6000",
      email: "help@allianz.com.au",
      address: "2 Market Street, Sydney, NSW 2000",
      lastVerified: "2026-09-23"
    },
    "aami": {
      customerCareNumber: "+61-13-22-44",
      claimHelpline: "+61-13-22-44",
      phone: "+61-3-8520-1300",
      email: "claims@aami.com.au",
      address: "Level 28, 266 George Street, Brisbane, QLD 4000",
      lastVerified: "2026-09-23"
    },
    "nrma": {
      customerCareNumber: "+61-132-132",
      claimHelpline: "+61-132-132",
      phone: "+61-2-9292-9222",
      email: "nrmainsurance@nrma.com.au",
      address: "201 Sussex Street, Sydney, NSW 2000",
      lastVerified: "2026-09-23"
    },
    "suncorp": {
      customerCareNumber: "+61-13-11-55",
      claimHelpline: "+61-13-11-55",
      phone: "+61-7-3362-1222",
      email: "directinsurance@suncorp.com.au",
      address: "Level 28, 266 George Street, Brisbane, QLD 4000",
      lastVerified: "2026-09-23"
    },
    "qbe": {
      customerCareNumber: "+61-133-723",
      claimHelpline: "+61-133-723",
      phone: "+61-2-9375-4444",
      email: "enquiries@qbe.com",
      address: "Level 18, 388 George Street, Sydney, NSW 2000",
      lastVerified: "2026-09-23"
    },
    "budget-direct": {
      customerCareNumber: "+61-1300-306-560",
      claimHelpline: "+61-1300-306-560",
      phone: "+61-7-3444-8888",
      email: "help@budgetdirect.com.au",
      address: "133 Charlotte Street, Brisbane, QLD 4000",
      lastVerified: "2026-09-23"
    }
  },

  // --- Germany ---
  de: {
    "dkv": {
      customerCareNumber: "+49-800-374-6444",
      claimHelpline: "+49-800-374-6444",
      phone: "+49-221-5780",
      email: "service@dkv.com",
      address: "Aachener Strasse 300, 50933 Cologne, Germany",
      lastVerified: "2026-09-23"
    },
    "ergo": {
      customerCareNumber: "+49-800-374-6000",
      claimHelpline: "+49-800-374-6000",
      phone: "+49-211-4770",
      email: "kundenservice@ergo.de",
      address: "ERGO-Platz 1, 40477 Duesseldorf, Germany",
      lastVerified: "2026-09-23"
    },
    "axa-de": {
      customerCareNumber: "+49-800-320-3200",
      claimHelpline: "+49-800-320-3200",
      phone: "+49-221-1480",
      email: "service@axa.de",
      address: "Colonia-Allee 10-20, 51067 Cologne, Germany",
      lastVerified: "2026-09-23"
    },
    "debeka": {
      customerCareNumber: "+49-261-4980",
      claimHelpline: "+49-261-4980",
      phone: "+49-261-4980",
      email: "kundenservice@debeka.de",
      address: "Ferdinand-Sauerbruch-Strasse 18, 56073 Koblenz, Germany",
      lastVerified: "2026-09-23"
    },
    "signal-iduna": {
      customerCareNumber: "+49-231-1350",
      claimHelpline: "+49-231-1350",
      phone: "+49-231-1350",
      email: "info@signal-iduna.de",
      address: "Joseph-Scherer-Strasse 3, 44139 Dortmund, Germany",
      lastVerified: "2026-09-23"
    },
    "huk-coburg": {
      customerCareNumber: "+49-800-215-3153",
      claimHelpline: "+49-800-215-3153",
      phone: "+49-9561-960",
      email: "info@huk-coburg.de",
      address: "Bahnhofsplatz, 96450 Coburg, Germany",
      lastVerified: "2026-09-23"
    },
    "gothaer": {
      customerCareNumber: "+49-221-308-00",
      claimHelpline: "+49-221-308-00",
      phone: "+49-221-308-00",
      email: "info@gothaer.de",
      address: "Arnoldiplatz 1, 50969 Cologne, Germany",
      lastVerified: "2026-09-23"
    },
    "barmenia": {
      customerCareNumber: "+49-202-438-00",
      claimHelpline: "+49-202-438-00",
      phone: "+49-202-438-00",
      email: "info@barmenia.de",
      address: "Barmenia-Allee 1, 42119 Wuppertal, Germany",
      lastVerified: "2026-09-23"
    },
    "hallesche": {
      customerCareNumber: "+49-800-319-1000",
      claimHelpline: "+49-800-319-1000",
      phone: "+49-711-66030",
      email: "service@hallesche.de",
      address: "Reinsburgstrasse 10, 70178 Stuttgart, Germany",
      lastVerified: "2026-09-23"
    },
    "continentale": {
      customerCareNumber: "+49-231-9190",
      claimHelpline: "+49-231-9190",
      phone: "+49-231-9190",
      email: "info@continentale.de",
      address: "Ruhrallee 92, 44139 Dortmund, Germany",
      lastVerified: "2026-09-23"
    },
    "hannoversche": {
      customerCareNumber: "+49-511-956-5656",
      claimHelpline: "+49-511-956-5656",
      phone: "+49-511-9560",
      email: "service@hannoversche.de",
      address: "VHV-Platz 1, 30177 Hanover, Germany",
      lastVerified: "2026-09-23"
    },
    "cosmosdirekt": {
      customerCareNumber: "+49-681-966-6666",
      claimHelpline: "+49-681-966-6666",
      phone: "+49-681-966-6666",
      email: "info@cosmosdirekt.de",
      address: "Halbergstrasse 50-60, 66121 Saarbruecken, Germany",
      lastVerified: "2026-09-23"
    },
    "europa": {
      customerCareNumber: "+49-221-5737-200",
      claimHelpline: "+49-221-5737-200",
      phone: "+49-221-5737-0",
      email: "info@europa.de",
      address: "Piusstrasse 137, 50931 Cologne, Germany",
      lastVerified: "2026-09-23"
    },
    "adac": {
      customerCareNumber: "+49-89-7676-0",
      claimHelpline: "+49-89-7676-0",
      phone: "+49-89-7676-0",
      email: "service@adac.de",
      address: "Hansastrasse 19, 80686 Munich, Germany",
      lastVerified: "2026-09-23"
    },
    "devk": {
      customerCareNumber: "+49-800-455-5333",
      claimHelpline: "+49-800-455-5333",
      phone: "+49-221-7570",
      email: "info@devk.de",
      address: "Riehler Strasse 190, 50735 Cologne, Germany",
      lastVerified: "2026-09-23"
    },
    "rv": {
      customerCareNumber: "+49-800-533-1112",
      claimHelpline: "+49-800-533-1112",
      phone: "+611-5330",
      email: "service@ruv.de",
      address: "Raiffeisenplatz 1, 65189 Wiesbaden, Germany",
      lastVerified: "2026-09-23"
    },
    "hansemerkur": {
      customerCareNumber: "+49-40-4119-0",
      claimHelpline: "+49-40-4119-0",
      phone: "+49-40-4119-0",
      email: "info@hansemerkur.de",
      address: "Siegfried-Wedells-Platz 1, 20354 Hamburg, Germany",
      lastVerified: "2026-09-23"
    },
    "envivas": {
      customerCareNumber: "+49-221-275-5999",
      claimHelpline: "+49-221-275-5999",
      phone: "+49-221-2750",
      email: "info@envivas.de",
      address: "Aachener Strasse 300, 50933 Cologne, Germany",
      lastVerified: "2026-09-23"
    }
  },

  // --- Saudi Arabia ---
  sa: {
    "medgulf": {
      customerCareNumber: "+966-800-441-4442",
      claimHelpline: "+966-800-441-4442",
      phone: "+966-13-897-7777",
      email: "customercare@medgulf.com.sa",
      address: "King Fahd Road, Al Khobar 31952, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "axa-coop-sa": {
      customerCareNumber: "+966-800-124-9990",
      claimHelpline: "+966-800-124-9990",
      phone: "+966-11-477-6100",
      email: "complaints@gig.com.sa",
      address: "Al Faisaliah Tower, King Fahd Road, Riyadh, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "walaa": {
      customerCareNumber: "+966-800-119-9222",
      claimHelpline: "+966-800-119-9222",
      phone: "+966-13-865-2222",
      email: "care@walaa.com",
      address: "Prince Sultan Street, Al Khobar, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "gulf-union": {
      customerCareNumber: "+966-800-304-0077",
      claimHelpline: "+966-800-304-0077",
      phone: "+966-13-833-3450",
      email: "customercare@gulfunion.com.sa",
      address: "Al Khobar Road, Dammam, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "saico": {
      customerCareNumber: "+966-800-124-7777",
      claimHelpline: "+966-800-124-7777",
      phone: "+966-11-475-9922",
      email: "customerservice@saico.com.sa",
      address: "Salahuddin Al Ayyubi Road, Riyadh 11442, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "malath": {
      customerCareNumber: "+966-800-128-0088",
      claimHelpline: "+966-800-128-0088",
      phone: "+966-11-416-8222",
      email: "info@malath.com.sa",
      address: "King Abdulaziz Road, Riyadh, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "alrajhi-takaful": {
      customerCareNumber: "+966-800-118-4444",
      claimHelpline: "+966-800-118-4444",
      phone: "+966-11-282-5555",
      email: "care@alrajhitakaful.com",
      address: "Al Thumama Road, Al Sahafah, Riyadh 13321, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "rsa-saudi": {
      customerCareNumber: "+966-800-124-8844",
      claimHelpline: "+966-800-124-8844",
      phone: "+966-11-478-0282",
      email: "info@rsasaudi.com",
      address: "Al Jamiah Street, Malaz, Riyadh, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "solidarity-sa": {
      customerCareNumber: "+966-800-304-0077",
      claimHelpline: "+966-800-304-0077",
      phone: "+966-11-478-0282",
      email: "info@solidarity.com.sa",
      address: "King Fahd Road, Riyadh, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "allianz-sf": {
      customerCareNumber: "+966-800-124-0010",
      claimHelpline: "+966-800-124-0010",
      phone: "+966-11-874-9700",
      email: "customercare@allianzsf.com.sa",
      address: "Al Safwah Centre, Prince Mamdouh Street, Riyadh, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "sagr-insurance": {
      customerCareNumber: "+966-800-304-0114",
      claimHelpline: "+966-800-304-0114",
      phone: "+966-13-830-2211",
      email: "care@sagr.com.sa",
      address: "Prince Mansoor Street, Al Khobar, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "acig": {
      customerCareNumber: "+966-800-124-0204",
      claimHelpline: "+966-800-124-0204",
      phone: "+966-12-606-8888",
      email: "customercare@acig.com.sa",
      address: "King Abdulaziz Road, Jeddah 21453, Saudi Arabia",
      lastVerified: "2026-09-23"
    },
    "chubb-arabia": {
      customerCareNumber: "+966-800-116-0038",
      claimHelpline: "+966-800-116-0038",
      phone: "+966-13-835-1212",
      email: "contact.arabia@chubb.com",
      address: "Al Khaleej Road, Dammam, Saudi Arabia",
      lastVerified: "2026-09-23"
    }
  },

  // --- Japan ---
  jp: {
    "sumitomo-life": {
      customerCareNumber: "+81-120-307-506",
      claimHelpline: "+81-120-307-506",
      phone: "+81-6-6937-1435",
      email: "customer@sumitomolife.co.jp",
      address: "1-4-35 Shiromi, Chuo-ku, Osaka 540-8512, Japan",
      lastVerified: "2026-09-23"
    },
    "aflac-jp": {
      customerCareNumber: "+81-120-555-595",
      claimHelpline: "+81-120-555-595",
      phone: "+81-3-5354-1111",
      email: "customer@aflac.co.jp",
      address: "1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 163-0456, Japan",
      lastVerified: "2026-09-23"
    },
    "metlife-jp": {
      customerCareNumber: "+81-120-881-796",
      claimHelpline: "+81-120-881-796",
      phone: "+81-3-6658-1000",
      email: "contact@metlife.co.jp",
      address: "1-3 Kioicho, Chiyoda-ku, Tokyo 102-8570, Japan",
      lastVerified: "2026-09-23"
    },
    "sony-life": {
      customerCareNumber: "+81-120-158-821",
      claimHelpline: "+81-120-158-821",
      phone: "+81-3-5785-6111",
      email: "customer@sonylife.co.jp",
      address: "1-9-2 Otemachi, Chiyoda-ku, Tokyo 100-0004, Japan",
      lastVerified: "2026-09-23"
    },
    "orix-life": {
      customerCareNumber: "+81-120-506-093",
      claimHelpline: "+81-120-506-093",
      phone: "+81-3-6685-6000",
      email: "info@orixlife.co.jp",
      address: "1-2-18 Shiba-Daimon, Minato-ku, Tokyo 105-0012, Japan",
      lastVerified: "2026-09-23"
    },
    "lifenet": {
      customerCareNumber: "+81-120-205-110",
      claimHelpline: "+81-120-205-110",
      phone: "+81-3-5216-7900",
      email: "info@lifenet-seimei.co.jp",
      address: "2-14-2 Kojimachi, Chiyoda-ku, Tokyo 102-0083, Japan",
      lastVerified: "2026-09-23"
    },
    "tokio-marine": {
      customerCareNumber: "+81-120-101-101",
      claimHelpline: "+81-120-101-101",
      phone: "+81-3-3212-6211",
      email: "customer@tokiomarine-nichido.co.jp",
      address: "1-2-1 Marunouchi, Chiyoda-ku, Tokyo 100-8050, Japan",
      lastVerified: "2026-09-23"
    },
    "sompo": {
      customerCareNumber: "+81-120-08-1572",
      claimHelpline: "+81-120-08-1572",
      phone: "+81-3-3349-3111",
      email: "customer@sompo-japan.co.jp",
      address: "1-26-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-8338, Japan",
      lastVerified: "2026-09-23"
    },
    "mitsui-sumitomo": {
      customerCareNumber: "+81-120-632-277",
      claimHelpline: "+81-120-632-277",
      phone: "+81-3-3297-1111",
      email: "customer@ms-ins.com",
      address: "3-9 Kanda-Surugadai, Chiyoda-ku, Tokyo 101-8011, Japan",
      lastVerified: "2026-09-23"
    },
    "axa-direct-jp": {
      customerCareNumber: "+81-120-959-154",
      claimHelpline: "+81-120-959-154",
      phone: "+81-3-6632-5000",
      email: "service@axa-direct.co.jp",
      address: "1-17-3 Shirokane, Minato-ku, Tokyo 108-8020, Japan",
      lastVerified: "2026-09-23"
    },
    "zurich-jp": {
      customerCareNumber: "+81-120-860-845",
      claimHelpline: "+81-120-860-845",
      phone: "+81-3-6832-7000",
      email: "service@zurich.co.jp",
      address: "4-1-1 Nakano, Nakano-ku, Tokyo 164-0001, Japan",
      lastVerified: "2026-09-23"
    },
    "sbi-insurance-jp": {
      customerCareNumber: "+81-120-953-615",
      claimHelpline: "+81-120-953-615",
      phone: "+81-3-6229-0820",
      email: "support@sbisonpo.co.jp",
      address: "1-6-1 Roppongi, Minato-ku, Tokyo 106-6016, Japan",
      lastVerified: "2026-09-23"
    }
  },

  // --- South Korea ---
  kr: {
    "kyobo-life": {
      customerCareNumber: "+82-1588-1001",
      claimHelpline: "+82-1588-1001",
      phone: "+82-2-721-2114",
      email: "help@kyobo.com",
      address: "1 Jong-ro, Jongno-gu, Seoul 03154, South Korea",
      lastVerified: "2026-09-23"
    },
    "mirae-asset": {
      customerCareNumber: "+82-1588-0220",
      claimHelpline: "+82-1588-0220",
      phone: "+82-2-3271-4000",
      email: "cs@miraeasset.com",
      address: "26 Eulji-ro 5-gil, Jung-gu, Seoul 04539, South Korea",
      lastVerified: "2026-09-23"
    },
    "db-insurance": {
      customerCareNumber: "+82-1588-0100",
      claimHelpline: "+82-1588-0100",
      phone: "+82-2-3011-3000",
      email: "customer@idbins.com",
      address: "432 Teheran-ro, Gangnam-gu, Seoul 06194, South Korea",
      lastVerified: "2026-09-23"
    },
    "kb-insurance": {
      customerCareNumber: "+82-1544-0114",
      claimHelpline: "+82-1544-0114",
      phone: "+82-2-6900-5000",
      email: "webmaster@kbinsure.co.kr",
      address: "117 Teheran-ro, Gangnam-gu, Seoul 06133, South Korea",
      lastVerified: "2026-09-23"
    },
    "meritz-fire": {
      customerCareNumber: "+82-1566-7711",
      claimHelpline: "+82-1566-7711",
      phone: "+82-2-3786-1114",
      email: "meritz@meritzfire.com",
      address: "382 Gangnam-daero, Gangnam-gu, Seoul 06232, South Korea",
      lastVerified: "2026-09-23"
    },
    "hyundai-marine": {
      customerCareNumber: "+82-1588-5656",
      claimHelpline: "+82-1588-5656",
      phone: "+82-2-3701-8000",
      email: "service@hi.co.kr",
      address: "163 Sejong-daero, Jongno-gu, Seoul 03172, South Korea",
      lastVerified: "2026-09-23"
    },
    "samsung-fire": {
      customerCareNumber: "+82-1588-5114",
      claimHelpline: "+82-1588-5114",
      phone: "+82-2-1588-5114",
      email: "service@samsungfire.com",
      address: "14 Eulji-ro, Jung-gu, Seoul 04533, South Korea",
      lastVerified: "2026-09-23"
    },
    "shinhan-life": {
      customerCareNumber: "+82-1588-5580",
      claimHelpline: "+82-1588-5580",
      phone: "+82-2-3455-4000",
      email: "shinhanlife@shinhan.com",
      address: "358 Cheonggyecheon-ro, Jung-gu, Seoul 04527, South Korea",
      lastVerified: "2026-09-23"
    },
    "heungkuk-life": {
      customerCareNumber: "+82-1588-7260",
      claimHelpline: "+82-1588-7260",
      phone: "+82-2-2002-7000",
      email: "cs@heungkuklife.co.kr",
      address: "68 Saemunan-ro, Jongno-gu, Seoul 03184, South Korea",
      lastVerified: "2026-09-23"
    },
    "nh-insurance": {
      customerCareNumber: "+82-1544-4000",
      claimHelpline: "+82-1544-4000",
      phone: "+82-2-2077-1000",
      email: "nhlife@nonghyup.com",
      address: "120 Tongil-ro, Jung-gu, Seoul 04517, South Korea",
      lastVerified: "2026-09-23"
    }
  },

  // --- Hong Kong ---
  hk: {
    "prudential-hk": {
      customerCareNumber: "+852-2281-1333",
      claimHelpline: "+852-2281-1333",
      phone: "+852-2281-1333",
      email: "service@prudential.com.hk",
      address: "8/F, Prudential Tower, The Gateway, Harbour City, 21 Canton Road, Tsim Sha Tsui, Kowloon, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "axa-hk": {
      customerCareNumber: "+852-2802-2812",
      claimHelpline: "+852-2802-2812",
      phone: "+852-2802-2812",
      email: "feedback@axa.com.hk",
      address: "Suite 2001, 20/F, Tower 1, The Gateway, Harbour City, 25 Canton Road, Kowloon, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "bupa-hk": {
      customerCareNumber: "+852-2517-5333",
      claimHelpline: "+852-2517-5333",
      phone: "+852-2517-5333",
      email: "customercare@bupa.com.hk",
      address: "6/F, Tower 2, The Quayside, 77 Hoi Bun Road, Kwun Tong, Kowloon, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "fwd-hk": {
      customerCareNumber: "+852-3123-3123",
      claimHelpline: "+852-3123-3123",
      phone: "+852-3123-3123",
      email: "cs.hk@fwd.com",
      address: "13/F, FWD Financial Centre, 308 Des Voeux Road Central, Sheung Wan, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "cigna-hk": {
      customerCareNumber: "+852-8100-3232",
      claimHelpline: "+852-8100-3232",
      phone: "+852-8100-3232",
      email: "contactus@cigna.com",
      address: "16/F, Tower 1, One Kowloon, 1 Wang Yuen Street, Kowloon Bay, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "sun-life-hk": {
      customerCareNumber: "+852-2103-8888",
      claimHelpline: "+852-2103-8888",
      phone: "+852-2103-8888",
      email: "hk_service@sunlife.com",
      address: "16/F, Cheung Kei Center, Tower A, 18 Hung Luen Road, Hung Hom, Kowloon, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "zurich-hk": {
      customerCareNumber: "+852-2968-2288",
      claimHelpline: "+852-2968-2288",
      phone: "+852-2968-2288",
      email: "enquiry@hk.zurich.com",
      address: "25-26/F, One Island East, 18 Westlands Road, Island East, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "hsbc-life-hk": {
      customerCareNumber: "+852-2583-8000",
      claimHelpline: "+852-2583-8000",
      phone: "+852-2583-8000",
      email: "life.insurance@hsbc.com.hk",
      address: "1 Queen's Road Central, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "china-life-hk": {
      customerCareNumber: "+852-3999-5519",
      claimHelpline: "+852-3999-5519",
      phone: "+852-3999-5519",
      email: "info@chinalife.com.hk",
      address: "22/F, CLI Building, 313 Hennessy Road, Wan Chai, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "boc-life-hk": {
      customerCareNumber: "+852-2860-0688",
      claimHelpline: "+852-2860-0688",
      phone: "+852-2860-0688",
      email: "cs@boclife.com.hk",
      address: "13/F, 1111 King's Road, Taikoo Shing, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "msig-hk": {
      customerCareNumber: "+852-3122-6922",
      claimHelpline: "+852-3122-6922",
      phone: "+852-3122-6922",
      email: "msighk@hk.msig-asia.com",
      address: "9/F, Cityplaza 3, 14 Taikoo Wan Road, Taikoo Shing, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "qbe-hk": {
      customerCareNumber: "+852-2828-1998",
      claimHelpline: "+852-2828-1998",
      phone: "+852-2828-1998",
      email: "info.hk@qbe.com",
      address: "33/F, Oxford House, Taikoo Place, 979 King's Road, Quarry Bay, Hong Kong",
      lastVerified: "2026-09-23"
    },
    "directasia-hk": {
      customerCareNumber: "+852-3999-7600",
      claimHelpline: "+852-3999-7600",
      phone: "+852-3999-7600",
      email: "customerservice@directasia.com.hk",
      address: "Suite 1502, 15/F, Sino Plaza, 255-257 Gloucester Road, Causeway Bay, Hong Kong",
      lastVerified: "2026-09-23"
    }
  }
};

let grandTotalUpdated = 0;

for (const [country, insurersMap] of Object.entries(CONTACT_DB)) {
  const filePath = path.join(DATA_DIR, country, "insurers.json");
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  let updatedInCountry = 0;

  data.insurers.forEach((ins) => {
    if (insurersMap[ins.slug]) {
      ins.contact = {
        ...(ins.contact || {}),
        ...insurersMap[ins.slug],
      };
      updatedInCountry++;
      grandTotalUpdated++;
    }
  });

  data.lastUpdated = "2026-09-23";
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
  console.log(`Updated ${updatedInCountry} insurers in ${country.toUpperCase()} (${filePath})`);
}

console.log(`\nSuccessfully updated ${grandTotalUpdated} total insurers across all 11 countries!`);
